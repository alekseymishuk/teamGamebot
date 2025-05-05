"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAddTask = handleAddTask;
exports.setupAddTask = setupAddTask;
const db_1 = require("../db");
const mainMenu_1 = require("../ui/mainMenu");
const waitingForTask = new Set();
async function handleAddTask(ctx) {
    const userId = ctx.from?.id?.toString();
    if (!userId)
        return;
    const participant = await db_1.prisma.participant.findUnique({
        where: { telegramId: userId },
    });
    if (!participant || !participant.gameId) {
        return ctx.reply('⛔ Ты не участвуешь в игре.');
    }
    if (participant.taskText && participant.taskText.trim() !== '') {
        ctx.reply(`❗ Ты уже ввёл задание\n
            ${participant.taskText}\n
            Чтобы изменить его, используй команду /edit_task`);
    }
    waitingForTask.add(userId);
    ctx.reply('✍️ Напиши задание своему партнёру по игре:');
}
function setupAddTask(bot) {
    bot.command('add_task', handleAddTask);
    bot.use(async (ctx, next) => {
        const userId = ctx.from?.id?.toString();
        const message = ctx.message;
        if (!message?.text || !userId)
            return next();
        const text = message.text.trim();
        // skip if the user is not waiting for a task
        if (!waitingForTask.has(userId))
            return next();
        // skip if the message is a command
        if (text.startsWith('/')) {
            waitingForTask.delete(userId);
            return next();
        }
        waitingForTask.delete(userId);
        try {
            const participant = await db_1.prisma.participant.findUnique({
                where: { telegramId: userId },
            });
            if (!participant || !participant.gameId) {
                return ctx.reply('⛔ Ты не участвуешь в игре.');
            }
            await db_1.prisma.participant.update({
                where: { telegramId: userId },
                data: { taskText: text },
            });
            ctx.reply('✅ Задание сохранено!', mainMenu_1.mainMenuKeyboard);
        }
        catch (err) {
            console.error('❌ Ошибка при сохранении задания:', err);
            ctx.reply('Произошла ошибка при сохранении задания. Попробуй позже.');
        }
    });
}
