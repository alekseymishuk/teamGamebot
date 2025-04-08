import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';

export function setupStartGame(bot: Telegraf) {
  bot.command('start_game', async (ctx: Context) => {
    const userId = ctx.from!.id.toString();

    const participant = await prisma.participant.findUnique({
      where: { telegramId: userId },
      include: { game: true },
    });

    if (!participant || !participant.isAdmin) {
      return ctx.reply('⛔ Только админ может запустить игру.');
    }

    const gameId = participant.gameId;

    const participants = await prisma.participant.findMany({
      where: { gameId },
    });

    if (participants.length < 2) {
      return ctx.reply('❗ Для начала игры нужно минимум два участника.');
    }

    const notReady = participants.filter(p => !p.taskText || p.taskText.trim() === '');
    if (notReady.length > 0) {
      return ctx.reply(`⛔ Не все участники ввели задания. Введи задание и попроси остальных.`);
    }

    // рандомное перемешивание
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // назначение заданий по кругу
    for (let i = 0; i < shuffled.length; i++) {
      const from = shuffled[i];
      const to = shuffled[(i + 1) % shuffled.length];

      await prisma.participant.update({
        where: { telegramId: to.telegramId },
        data: {
          receivedTask: from.taskText,
          taskSentAt: new Date(),
        },
      });

      try {
        await ctx.telegram.sendMessage(to.telegramId, `🎯 Твоё задание: "${from.taskText}"`);
      } catch (err) {
        console.error(`❌ Не удалось отправить задание @${to.username}:`, err);
      }
    }

    await prisma.game.update({
      where: { id: gameId },
      data: { status: 'IN_PROGRESS' },
    });

    ctx.reply('🚀 Игра запущена! Задания отправлены участникам.');
  });
}
