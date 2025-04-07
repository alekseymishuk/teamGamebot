import { Telegraf } from 'telegraf';
import { prisma } from '../db';

export function setupComplete(bot: Telegraf) {
  bot.command('complete', async (ctx) => {
    const telegramId = ctx.from.id.toString();

    const participant = await prisma.participant.findUnique({
      where: { telegramId },
    });

    if (!participant || !participant.receivedTask) {
      return ctx.reply('У тебя ещё нет активного задания или ты не зарегистрирован.');
    }

    if (participant.taskCompleted) {
      return ctx.reply('Ты уже выполнил задание — красавчик!');
    }

    await prisma.participant.update({
      where: { telegramId },
      data: {
        taskCompleted: true,
        points: { increment: 3 },
      },
    });

    ctx.reply('✅ Выполнение задания засчитано. Очки начислены.');
  });
}
