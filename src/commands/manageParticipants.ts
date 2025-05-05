import { Telegraf, Context, Markup } from 'telegraf';
import { prisma } from '../db';

export function setupManageParticipants(bot: Telegraf) {
    bot.command('participants', async (ctx: Context) => {
        const userId = ctx.from?.id.toString();
        if (!userId) return;

        const admin = await prisma.participant.findUnique({
            where: { telegramId: userId },
            include: { game: true },
        });

        if (!admin || !admin.isAdmin) {
            return ctx.reply('⛔ Только админ может просматривать участников.');
        }

        const participants = await prisma.participant.findMany({
            where: { gameId: admin.gameId },
        });

        if (participants.length === 0) {
            return ctx.reply('❗ В игре пока нет участников.');
        }

        const buttons = participants
            .map(p =>
                Markup.button.callback(
                    `❌ ${p.username || 'без_имени'}`,
                    `remove_${p.telegramId}`
                )
            );

        console.log('🔍 gameId для админа:', admin.gameId);
        ctx.reply('👥 Участники игры:', Markup.inlineKeyboard(buttons, { columns: 1 }));
    });

    bot.action(/^remove_(.+)$/, async (ctx) => {
        const adminId = ctx.from.id.toString();
        const targetId = ctx.match[1];

        const admin = await prisma.participant.findUnique({
            where: { telegramId: adminId },
        });

        if (!admin || !admin.isAdmin) {
            return ctx.answerCbQuery('⛔ Только админ может удалять участников.', { show_alert: true });
        }

        if (admin.telegramId === targetId) {
            return ctx.answerCbQuery('Нельзя удалить себя 🤔', { show_alert: true });
        }

        try {
            await prisma.guess.deleteMany({
                where: {
                    OR: [
                        { guesserId: targetId },
                        { targetId: targetId },
                    ],
                },
            });

            await prisma.participant.delete({
                where: { telegramId: targetId },
            });

            await ctx.editMessageText('✅ Участник удалён.');
        } catch (err) {
            console.error('❌ Ошибка при удалении участника:', err);
            ctx.reply('Произошла ошибка при удалении участника.');
        }

        await ctx.answerCbQuery();
    });
}
