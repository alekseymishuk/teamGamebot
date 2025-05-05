"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupStart = setupStart;
const db_1 = require("../db");
const mainMenu_1 = require("../ui/mainMenu");
const addTask_1 = require("./addTask");
function setupStart(bot) {
    bot.start(async (ctx) => {
        const userId = ctx.from.id.toString();
        const username = ctx.from.username || ctx.from.first_name;
        const code = ctx.startPayload?.trim().toUpperCase();
        if (!code) {
            return ctx.reply('Привет! Добро пожаловать 👋\nИспользуй кнопки ниже:', mainMenu_1.mainMenuKeyboard);
        }
        const game = await db_1.prisma.game.findUnique({ where: { code } });
        if (!game) {
            return ctx.reply('⛔ Игра с таким кодом не найдена. Проверь ссылку или код.');
        }
        const existing = await db_1.prisma.participant.findFirst({
            where: {
                telegramId: userId,
                gameId: game.id,
            },
        });
        if (existing) {
            if (!existing.taskText || existing.taskText.trim() === '') {
                ctx.reply(`👋 Ты уже в игре с кодом ${code}`);
                (0, addTask_1.handleAddTask)(ctx); // сразу переходим к добавлению задания
                return;
            }
            else {
                return ctx.reply(`👋 С возвращением в игру с кодом ${code}!`, mainMenu_1.mainMenuKeyboard);
            }
        }
        // добавляем участника в игру
        await db_1.prisma.participant.create({
            data: {
                telegramId: userId,
                username,
                taskText: '',
                isAdmin: false,
                gameId: game.id,
            },
        });
        ctx.reply(`✅ Ты присоединился к игре с кодом *${code}*!`);
        (0, addTask_1.handleAddTask)(ctx); // сразу переходим к добавлению задания
    });
}
