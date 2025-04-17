import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';
import type { Message } from 'telegraf/typings/core/types/typegram';
import { mainMenuKeyboard } from '../ui/mainMenu';

const waitingForTask = new Set<string>();

export async function handleAddTask(ctx: Context) {
    const userId = ctx.from?.id?.toString();
    if (!userId) return;

    const participant = await prisma.participant.findUnique({
        where: { telegramId: userId },
    });

    if (!participant || !participant.gameId) {
        return ctx.reply('⛔ Ты не участвуешь в игре.');
    }

    if (participant.taskText && participant.taskText.trim() !== '') {
        ctx.reply(`❗ Ты уже ввёл задание\n
            ${participant.taskText}\n
            Чтобы изменить его, используй команду /edit_task`
        );

    }

    waitingForTask.add(userId);
    ctx.reply('✍️ Напиши задание своему партнёру по игре:');
}

export function setupAddTask(bot: Telegraf) {
    bot.command('add_task', handleAddTask);

    bot.use(async (ctx, next) => {
        const userId = ctx.from?.id?.toString();
        const message = ctx.message as Message.TextMessage | undefined;

        if (!message?.text || !userId) return next();

        const text = message.text.trim();

        // Если пользователь не в режиме ввода задания — пропускаем
        if (!waitingForTask.has(userId)) return next();

        // Если это команда — отменяем ожидание
        if (text.startsWith('/')) {
            waitingForTask.delete(userId);
            return next();
        }

        waitingForTask.delete(userId);

        try {
            const participant = await prisma.participant.findUnique({
                where: { telegramId: userId },
            });

            if (!participant || !participant.gameId) {
                return ctx.reply('⛔ Ты не участвуешь в игре.');
            }

            await prisma.participant.update({
                where: { telegramId: userId },
                data: { taskText: text },
            });

            ctx.reply('✅ Задание сохранено!', mainMenuKeyboard);
        } catch (err) {
            console.error('❌ Ошибка при сохранении задания:', err);
            ctx.reply('Произошла ошибка при сохранении задания. Попробуй позже.');
        }
    });
}
