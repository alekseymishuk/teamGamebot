import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';

export async function handleShowGames(ctx: Context) {
  const telegramId = ctx.from!.id.toString();
  console.log('🔥 /games вызвана от', ctx.from?.username);

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

  console.log('🎮 Найдено игр:', games.length);

  if (!games.length) {
    return ctx.reply('Ты не участвуешь ни в одной игре.');
  }

  const msg = games.map((g, i) => {
    const role = g.participants.find(p => p.telegramId === telegramId)?.isAdmin ? 'Создатель' : 'Участник';
    return `${i + 1}. Код: *${g.code}* | ${g.status} | ${role}`;
  }).join('\n');

  return ctx.reply(`📋 Твои игры:

${msg}`, { parse_mode: 'Markdown' });
}

export function setupGames(bot: Telegraf) {
  bot.command('games', handleShowGames);
}