import { Telegraf } from 'telegraf';
import { prisma } from '../db';
import { isAdmin } from '../utils/isAdmin';

export function setupStatus(bot: Telegraf) {
  bot.command('status', async (ctx) => {
    const telegramId = ctx.from.id;

    if (!isAdmin(telegramId)) {
      return ctx.reply('Эта команда доступна только администратору.');
    }

    const game = await prisma.game.findFirst({
      where: { status: { in: ['WAITING', 'IN_PROGRESS'] } },
      include: {
        participants: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!game || game.participants.length === 0) {
      return ctx.reply('Нет активной игры или участников.');
    }

    const statusLines = game.participants.map((p, i) => {
      return `${i + 1}. @${p.username || 'неизвестен'} — ${
        p.taskText ? '✅ задание задано' : '❌ нет задания'
      } | ${
        p.receivedTask
          ? p.taskCompleted
            ? '🎯 выполнено'
            : '📨 задание получено'
          : '⌛ ожидает выдачи'
      } | ${p.points} очков`;
    });

    ctx.reply(`📊 Статус игры:\n\n${statusLines.join('\n')}`);
  });
}
