"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleComplete = handleComplete;
exports.setupComplete = setupComplete;
const db_1 = require("../db");
async function handleComplete(ctx) {
    const telegramId = ctx.from.id.toString();
    const participant = await db_1.prisma.participant.findUnique({ where: { telegramId } });
    if (!participant || !participant.receivedTask) {
        return ctx.reply('У тебя ещё нет активного задания.');
    }
    if (participant.taskCompleted) {
        return ctx.reply('Ты уже выполнил задание.');
    }
    await db_1.prisma.participant.update({
        where: { telegramId },
        data: {
            taskCompleted: true,
            points: { increment: 3 },
        },
    });
    ctx.reply('✅ Задание засчитано. +3 очка!');
}
function setupComplete(bot) {
    bot.command('complete', handleComplete);
}
