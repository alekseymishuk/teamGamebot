"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupJoinManual = setupJoinManual;
const db_1 = require("../db");
const waitingForCode = new Set();
function setupJoinManual(bot) {
    bot.command('join_by_code', (ctx) => {
        const userId = ctx.from.id.toString();
        waitingForCode.add(userId);
        ctx.reply('Введи код игры, чтобы присоединиться:');
    });
    // 💡 Используем bot.use — не блокирует другие команды
    bot.use(async (ctx, next) => {
        const userId = ctx.from?.id.toString();
        const message = ctx.message;
        if (!message || !message.text || !userId) {
            return next(); // если нет текста — пропускаем
        }
        const text = message.text.trim();
        if (!waitingForCode.has(userId))
            return next();
        if (text.startsWith('/')) {
            waitingForCode.delete(userId);
            return next();
        }
        waitingForCode.delete(userId);
        // Далее логика с кодом:
        const code = text.toUpperCase();
        const game = await db_1.prisma.game.findUnique({ where: { code } });
        if (!game) {
            return ctx.reply('Игра с таким кодом не найдена.');
        }
        const exists = await db_1.prisma.participant.findUnique({
            where: { telegramId: userId },
        });
        if (exists) {
            return ctx.reply('Ты уже участвуешь в игре.');
        }
        await db_1.prisma.participant.create({
            data: {
                telegramId: userId,
                username: ctx.from.username || ctx.from.first_name,
                taskText: '',
                gameId: game.id,
            },
        });
        ctx.reply(`✅ Ты присоединился к игре с кодом *${code}*! Введи своё задание.`);
    });
}
