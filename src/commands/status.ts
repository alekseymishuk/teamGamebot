import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';

export async function handleStatus(ctx: Context) {
  const telegramId = ctx.from!.id.toString();

  const game = await prisma.game.findFirst({
    where: {
      participants: {
        some: { telegramId },
      },
      status: { in: ['WAITING', 'IN_PROGRESS'] },
    },
    include: {
      participants: true,
    },
  });

  if (!game) {
    return ctx.reply('Ты не в активной игре.');
  }

  const lines = game.participants.map((p, i) => {
    return `${i + 1}. @${p.username} — ${p.points} очков | ${p.taskCompleted ? '✅ Выполнил' : '⏳ В процессе'} | ${p.taskText ? 'Задание ✅' : 'Задание ❌'}`;
  });

  ctx.reply(`📊 Статус участников:

${lines.join('\n')}`);
}

export function setupStatus(bot: Telegraf) {
  bot.command('status', handleStatus);
}