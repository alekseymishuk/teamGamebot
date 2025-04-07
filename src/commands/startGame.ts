import { Telegraf } from 'telegraf';
import { prisma } from '../db';
import { isAdmin } from '../utils/isAdmin';

export function setupStartGame(bot: Telegraf) {
  bot.command('start_game', async (ctx) => {
    const telegramId = ctx.from.id;

    if (!isAdmin(telegramId)) {
      return ctx.reply('Только админ может запускать игру.');
    }

    const game = await prisma.game.findFirst({
      where: { status: 'WAITING' },
      include: { participants: true },
    });

    if (!game || game.participants.length < 2) {
      return ctx.reply('Недостаточно участников или игра уже началась.');
    }

    const shuffled = [...game.participants].sort(() => Math.random() - 0.5);

    // Назначаем задания (каждому следующего)
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];

      await prisma.participant.update({
        where: { id: receiver.id },
        data: {
          receivedTask: giver.taskText,
          assignedToId: giver.id,
        },
      });
    }

    // Обновляем статус игры
    await prisma.game.update({
      where: { id: game.id },
      data: { status: 'IN_PROGRESS' },
    });

    ctx.reply('Игра началась! Задания будут высланы участникам случайно.');

    // Рассылка заданий в случайный момент (от 1 до 5 минут)
    for (const p of game.participants) {
      const delay = Math.floor(Math.random() * 4 + 1) * 60 * 1000;

      setTimeout(async () => {
        try {
          await bot.telegram.sendMessage(
            Number(p.telegramId),
            `🔍 Вот твоё секретное задание:\n\n${p.receivedTask}`
          );

          await prisma.participant.update({
            where: { id: p.id },
            data: { taskSentAt: new Date() },
          });
        } catch (err) {
          console.error(`❗ Ошибка при отправке задания ${p.username}`, err);
        }
      }, delay);
    }

    // Авто-завершение игры через 30 минут
    setTimeout(async () => {
      const updatedGame = await prisma.game.findUnique({
        where: { id: game.id },
        include: { participants: true },
      });

      if (updatedGame?.status === 'IN_PROGRESS') {
        await prisma.game.update({
          where: { id: game.id },
          data: { status: 'ENDED' },
        });

        const leaderboard = updatedGame.participants
          .sort((a, b) => b.points - a.points)
          .map((p, i) => `${i + 1}. @${p.username} — ${p.points} очков`);

        await bot.telegram.sendMessage(
          telegramId,
          `⏳ Время вышло!\n\n🏁 Игра завершена!\n\n🏆 Таблица лидеров:\n\n${leaderboard.join('\n')}`
        );
      }
    }, 30 * 60 * 1000); // 30 минут
  });
}
