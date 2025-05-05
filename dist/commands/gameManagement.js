"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGameManagement = setupGameManagement;
const db_1 = require("../db");
function setupGameManagement(bot) {
    // 1. leave_game
    bot.command('leave_game', async (ctx) => {
        const userId = ctx.from.id.toString();
        const participant = await db_1.prisma.participant.findUnique({
            where: { telegramId: userId },
        });
        if (!participant)
            return ctx.reply('Ты не в игре.');
        await db_1.prisma.participant.delete({
            where: { telegramId: userId },
        });
        ctx.reply('🚪 Ты вышел из игры.');
    });
    // 2. delete_game (only for admin)
    bot.command('delete_game', async (ctx) => {
        const userId = ctx.from.id.toString();
        const participant = await db_1.prisma.participant.findUnique({
            where: { telegramId: userId },
            include: { game: true },
        });
        if (!participant || !participant.isAdmin) {
            return ctx.reply('⛔ Только админ может удалять игру.');
        }
        await db_1.prisma.participant.deleteMany({
            where: { gameId: participant.gameId },
        });
        await db_1.prisma.game.delete({
            where: { id: participant.gameId },
        });
        ctx.reply('🗑 Игра удалена.');
    });
}
