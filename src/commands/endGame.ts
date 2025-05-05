import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';
import { handleDeleteGame } from './gameManagement';

export function setupEndGame(bot: Telegraf) {
  bot.command('end_game', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    const admin = await prisma.participant.findUnique({
      where: { telegramId },
    });

    if (!admin || !admin.isAdmin) {
      return ctx.reply('⛔ Только админ может завершить игру.');
    }

    const gameId = admin.gameId;

    await prisma.game.update({
      where: { id: gameId },
      data: { status: 'ENDED' },
    });

    const participants = await prisma.participant.findMany({
      where: { gameId },
    });

    const guesses = await prisma.guess.findMany({
      where: {
        OR: [
          { guesserId: { in: participants.map(p => p.telegramId) } },
          { targetId: { in: participants.map(p => p.telegramId) } },
        ],
      },
    });

    const summaryLines: string[] = [];

    for (const [index, participant] of participants.entries()) {
      const name = participant.username || 'без_имени';

      const correctGuesses = guesses.filter(
        g => g.guesserId === participant.telegramId && g.isCorrect
      ).length;

      const taskCompleted = participant.taskCompleted ? '✅' : '❌';

      // определяем, кто получил задание от этого участника
      const taskReceiver = participants.find(
        p => p.receivedTask === participant.taskText
      );

      const star = taskReceiver ? '⭐' : '';

      summaryLines.push(
        `${index + 1}. ${name} ${taskCompleted} | Угадал: ${correctGuesses} ${star}`
      );
    }

    const summary = summaryLines.join('\n');

    for (const p of participants) {
      try {
        await ctx.telegram.sendMessage(
          p.telegramId,
          `🏁 Игра завершена!\n\n📊 Результаты:\n${summary}`
        );
      } catch (err) {
        console.error(`❌ Не удалось отправить результат @${p.username}:`, err);
      }
    }
    handleDeleteGame(ctx);
  });
}
