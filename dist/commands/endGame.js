"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEndGame = setupEndGame;
const db_1 = require("../db");
const isAdmin_1 = require("../utils/isAdmin");
function setupEndGame(bot) {
    bot.command('end_game', async (ctx) => {
        const telegramId = ctx.from.id;
        if (!(0, isAdmin_1.isAdmin)(telegramId)) {
            return ctx.reply('Только админ может завершить игру.');
        }
        const game = await db_1.prisma.game.findFirst({
            where: { status: 'IN_PROGRESS' },
            include: {
                participants: true,
            },
        });
        if (!game)
            return ctx.reply('Нет активной игры.');
        await db_1.prisma.game.update({
            where: { id: game.id },
            data: { status: 'ENDED' },
        });
        const leaderboard = game.participants
            .sort((a, b) => b.points - a.points)
            .map((p, i) => `${i + 1}. @${p.username} — ${p.points} очков`);
        ctx.reply(`🏁 Игра завершена!\n\n🏆 Таблица лидеров:\n\n${leaderboard.join('\n')}`);
    });
}
