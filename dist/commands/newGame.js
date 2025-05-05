"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateGame = handleCreateGame;
exports.setupNewGame = setupNewGame;
const db_1 = require("../db");
const generateGameCode_1 = require("../utils/generateGameCode");
const addTask_1 = require("./addTask");
async function handleCreateGame(ctx) {
    const userId = ctx.from.id.toString();
    const username = ctx.from.username || ctx.from.first_name;
    const code = (0, generateGameCode_1.generateGameCode)();
    // проверяем, есть ли уже такой участник
    const existing = await db_1.prisma.participant.findUnique({
        where: { telegramId: userId },
    });
    if (existing) {
        return ctx.reply('Ты уже зарегистрирован в игре. Используй /games чтобы посмотреть список.');
    }
    // создаём игру и участника
    await db_1.prisma.game.create({
        data: {
            code,
            participants: {
                create: {
                    telegramId: userId,
                    username,
                    taskText: '',
                    isAdmin: true,
                },
            },
        },
    });
    await ctx.reply(`🆕 Игра создана!\nКод: ${code}\nСсылка: https://t.me/${ctx.botInfo?.username}?start=${code}`);
    await ctx.reply(`👤 Ты — администратор этой игры.\n\nИспользуй /games чтобы посмотреть список игр.`);
    (0, addTask_1.handleAddTask)(ctx); // сразу переходим к добавлению задания
}
function setupNewGame(bot) {
    bot.command('new_game', handleCreateGame);
}
