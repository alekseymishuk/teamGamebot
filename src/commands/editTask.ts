import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';
import type { Message } from 'telegraf/typings/core/types/typegram';

const waitingForEdit = new Set<string>();

const handleEditTask = async (ctx: Context) => {
    const userId = ctx.from?.id.toString();
    if (!userId) return;

    const participant = await prisma.participant.findUnique({
        where: { telegramId: userId },
    });

    if (!participant) {
        return ctx.reply('⛔ Ты не участвуешь ни в одной игре.');
    }

    const current = participant.taskText?.trim();
    if (current) {
        await ctx.reply(`📝 Введенное задание:\n"${current}"`);
    }

    const game = await prisma.game.findFirst({
        where: { id: participant.gameId }
    })

    if (game?.status === "IN_PROGRESS") {
        return ctx.reply('❗ Нельзя менять задание в процессе игры.');
    }

    waitingForEdit.add(userId);
    ctx.reply('✏️ Введи новое задание:');
};

export function setupEditTask(bot: Telegraf) {
    bot.command('edit_task', handleEditTask);

    bot.use(async (ctx, next) => {
        const userId = ctx.from?.id.toString();
        const message = ctx.message as Message.TextMessage | undefined;

        if (!message?.text || !userId) return next();

        const text = message.text.trim();

        if (!waitingForEdit.has(userId)) return next();

        if (text.startsWith('/')) {
            waitingForEdit.delete(userId);
            return next();
        }

        await prisma.participant.update({
            where: { telegramId: userId },
            data: { taskText: text },
        });

        waitingForEdit.delete(userId);
        ctx.reply('✅ Задание обновлено.');
    });
}
