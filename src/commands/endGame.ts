import { Telegraf } from 'telegraf';
import { prisma } from '../db';
import { isAdmin } from '../utils/isAdmin';

export function setupEndGame(bot: Telegraf) {
  bot.command('end_game', async (ctx) => {
    const telegramId = ctx.from.id;

    if (!isAdmin(telegramId)) {
      return ctx.reply('Только админ может завершить игру.');
    }

    const game = await prisma.game.findFirst({
      where: { status: 'IN_PROGRESS' },
      include: {
        participants: true,
      },
    });

    if (!game) return ctx.reply('Нет активной игры.');

    await prisma.game.update({
      where: { id: game.id },
      data: { status: 'ENDED' },
    });

    const leaderboard = game.participants
      .sort((a, b) => b.points - a.points)
      .map((p, i) => `${i + 1}. @${p.username} — ${p.points} очков`);

    ctx.reply(`🏁 Игра завершена!\n\n🏆 Таблица лидеров:\n\n${leaderboard.join('\n')}`);
  });
}
