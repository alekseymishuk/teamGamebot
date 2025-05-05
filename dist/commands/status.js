"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStatus = handleStatus;
exports.setupStatus = setupStatus;
const db_1 = require("../db");
async function handleStatus(ctx) {
    const telegramId = ctx.from.id.toString();
    const game = await db_1.prisma.game.findFirst({
        where: {
            participants: {
                some: { telegramId },
            },
            status: { in: ['WAITING', 'IN_PROGRESS'] },
        },
        include: {
            participants: true,
        },
    });
    if (!game) {
        return ctx.reply('Ты не в активной игре.');
    }
    const lines = game.participants.map((p, i) => {
        return `${i + 1}. @${p.username} — ${p.points} очков | ${p.taskCompleted ? '✅ Выполнил' : '⏳ В процессе'} | ${p.taskText ? 'Задание ✅' : 'Задание ❌'}`;
    });
    ctx.reply(`📊 Статус участников:

${lines.join('\n')}`);
}
function setupStatus(bot) {
    bot.command('status', handleStatus);
}
