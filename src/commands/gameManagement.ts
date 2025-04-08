import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';

export function setupGameManagement(bot: Telegraf) {
  // 1. Выйти из игры
  bot.command('leave_game', async (ctx) => {
    const userId = ctx.from!.id.toString();

    const participant = await prisma.participant.findUnique({
      where: { telegramId: userId },
    });

    if (!participant) return ctx.reply('Ты не в игре.');

    await prisma.participant.delete({
      where: { telegramId: userId },
    });

    ctx.reply('🚪 Ты вышел из игры.');
  });

  // 2. Удалить игру (только админ)
  bot.command('delete_game', async (ctx) => {
    const userId = ctx.from!.id.toString();

    const participant = await prisma.participant.findUnique({
      where: { telegramId: userId },
      include: { game: true },
    });

    if (!participant || !participant.isAdmin) {
      return ctx.reply('⛔ Только админ может удалять игру.');
    }

    await prisma.participant.deleteMany({
      where: { gameId: participant.gameId },
    });

    await prisma.game.delete({
      where: { id: participant.gameId },
    });

    ctx.reply('🗑 Игра удалена.');
  });
}
