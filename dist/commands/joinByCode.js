"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupJoinByCode = setupJoinByCode;
const db_1 = require("../db");
function setupJoinByCode(bot) {
    bot.start(async (ctx) => {
        const code = ctx.payload;
        const telegramId = ctx.from.id.toString();
        const username = ctx.from.username || ctx.from.first_name;
        console.log('📦 Payload:', ctx.payload);
        if (!code) {
            return ctx.reply('Чтобы присоединиться к игре, введи код от создателя.');
        }
        const game = await db_1.prisma.game.findUnique({
            where: { code },
        });
        if (!game) {
            return ctx.reply('Игра с таким кодом не найдена.');
        }
        const existing = await db_1.prisma.participant.findUnique({
            where: { telegramId },
        });
        if (existing) {
            return ctx.reply('Ты уже участвуешь в игре!');
        }
        await db_1.prisma.participant.create({
            data: {
                telegramId,
                username,
                taskText: '',
                gameId: game.id,
                isAdmin: false,
            },
        });
        ctx.reply(`Ты теперь в игре с кодом *${code}*!\nОтправь задание, которое кто-то другой должен будет выполнить.`);
    });
}
