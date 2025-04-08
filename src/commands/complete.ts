import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';

export async function handleComplete(ctx: Context) {
  const telegramId = ctx.from!.id.toString();
  const participant = await prisma.participant.findUnique({ where: { telegramId } });

  if (!participant || !participant.receivedTask) {
    return ctx.reply('У тебя ещё нет активного задания.');
  }

  if (participant.taskCompleted) {
    return ctx.reply('Ты уже выполнил задание.');
  }

  await prisma.participant.update({
    where: { telegramId },
    data: {
      taskCompleted: true,
      points: { increment: 3 },
    },
  });

  ctx.reply('✅ Задание засчитано. +3 очка!');
}

export function setupComplete(bot: Telegraf) {
  bot.command('complete', handleComplete);
}