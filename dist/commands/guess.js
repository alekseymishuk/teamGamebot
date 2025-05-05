"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGuess = setupGuess;
const db_1 = require("../db");
const string_similarity_1 = require("string-similarity");
function setupGuess(bot) {
    bot.command('guess', async (ctx) => {
        const telegramId = ctx.from.id.toString();
        const text = ctx.message.text;
        const parts = text.split(' ');
        if (parts.length < 3) {
            return ctx.reply('Формат: /guess @username "текст задания"');
        }
        const usernameGuess = parts[1].replace('@', '').trim();
        const guessText = parts.slice(2).join(' ').trim().toLowerCase();
        const guesser = await db_1.prisma.participant.findUnique({
            where: { telegramId },
        });
        const target = await db_1.prisma.participant.findFirst({
            where: { username: usernameGuess },
        });
        if (!guesser || !target || !target.taskText) {
            return ctx.reply('Неверный username или участник не найден.');
        }
        // compareTwoStrings is a function from the string-similarity library
        const similarity = (0, string_similarity_1.compareTwoStrings)(guessText.toLowerCase(), target.taskText.toLowerCase());
        const isCorrect = similarity >= 0.7;
        await db_1.prisma.guess.create({
            data: {
                guessText,
                isCorrect,
                guesserId: guesser.id,
                targetId: target.id.toString(),
            },
        });
        if (isCorrect) {
            await db_1.prisma.participant.update({
                where: { id: guesser.id },
                data: { points: { increment: 2 } },
            });
            ctx.reply(`🎯 Угадано верно! +2 очка тебе! (похожесть: ${(similarity * 100).toFixed(0)}%)`);
        }
        else {
            ctx.reply(`❌ Не угадал. Похожесть: ${(similarity * 100).toFixed(0)}%`);
        }
    });
}
