"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleShowGames = handleShowGames;
exports.setupGames = setupGames;
const db_1 = require("../db");
async function handleShowGames(ctx) {
    const telegramId = ctx.from.id.toString();
    console.log('🔥 /games вызвана от', ctx.from?.username);
    const games = await db_1.prisma.game.findMany({
        where: {
            participants: {
                some: { telegramId },
            },
        },
        include: {
            participants: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    console.log('🎮 Найдено игр:', games.length);
    if (!games.length) {
        return ctx.reply('Ты не участвуешь ни в одной игре.');
    }
    const msg = games.map((g, i) => {
        const role = g.participants.find(p => p.telegramId === telegramId)?.isAdmin ? 'Создатель' : 'Участник';
        return `${i + 1}. Код: *${g.code}* | ${g.status} | ${role}`;
    }).join('\n');
    return ctx.reply(`📋 Твои игры:

${msg}`);
}
function setupGames(bot) {
    bot.command('games', handleShowGames);
}
