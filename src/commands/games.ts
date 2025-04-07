import { Telegraf } from 'telegraf';
import { prisma } from '../db';

export function setupGames(bot: Telegraf) {
  bot.command('games', async (ctx) => {
    const telegramId = ctx.from.id.toString();

    const games = await prisma.game.findMany({
      where: {
        participants: {
          some: { telegramId },
        },
      },
      include: {
        participants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!games.length) {
      return ctx.reply('Ты пока не участвуешь ни в одной игре.');
    }

    const message = games
      .map((g, i) => {
        const me = g.participants.find(p => p.telegramId === telegramId);
        const role = me?.isAdmin ? 'Создатель' : 'Участник';
        return `${i + 1}. Код: *${g.code}* | Статус: _${g.status}_ | ${role}`;
      })
      .join('\n');

    ctx.reply(`📋 Твои игры:\n\n${message}`, { parse_mode: 'Markdown' });
  });
}
