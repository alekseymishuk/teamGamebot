import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';

export function setupGameManagement(bot: Telegraf) {
  // 1. leave_game
  bot.command('leave_game', async (ctx) => {
    const telegramId = ctx.from!.id.toString();

    const participant = await prisma.participant.findUnique({
      where: { telegramId },
    });

    if (!participant) return ctx.reply('Ты не в игре.');

    try {
      // удаляем связанные догадки
      await prisma.guess.deleteMany({
        where: {
          OR: [
            { guesserId: telegramId },
            { targetId: telegramId },
          ],
        },
      });

      // удаляем участника
      await prisma.participant.delete({
        where: { telegramId },
      });

      ctx.reply('🚪 Ты покинул игру. Твоя запись удалена.');
    } catch (err) {
      console.error('Ошибка при удалении участника:', err);
      ctx.reply('Произошла ошибка при выходе из игры.');
    }

  });

  // 2. delete_game (only for admin)
  bot.command('delete_game', handleDeleteGame);
}

export const handleDeleteGame = async (ctx: Context) => {
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
};
