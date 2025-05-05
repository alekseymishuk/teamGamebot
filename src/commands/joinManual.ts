import { Telegraf } from 'telegraf';
import { prisma } from '../db';
import type { Message } from 'telegraf/typings/core/types/typegram';

const waitingForCode = new Set<string>();

export function setupJoinManual(bot: Telegraf) {
  bot.command('join_by_code', (ctx) => {
    const userId = ctx.from.id.toString();
    waitingForCode.add(userId);
    ctx.reply('Введи код игры, чтобы присоединиться:');
  });

  bot.use(async (ctx, next) => {
    const userId = ctx.from?.id.toString();
    const message = ctx.message as Message.TextMessage | undefined;

    if (!message || !message.text || !userId) {
      return next(); // если нет текста — пропускаем
    }

    const text = message.text.trim();

    if (!waitingForCode.has(userId)) return next();
    if (text.startsWith('/')) {
      waitingForCode.delete(userId);
      return next();
    }

    waitingForCode.delete(userId);

    const code = text.toUpperCase();
    const game = await prisma.game.findUnique({ where: { code } });

    if (!game) {
      return ctx.reply('Игра с таким кодом не найдена.');
    }

    const exists = await prisma.participant.findUnique({
      where: { telegramId: userId },
    });

    if (exists) {
      return ctx.reply('Ты уже участвуешь в игре.');
    }

    await prisma.participant.create({
      data: {
        telegramId: userId,
        username: ctx.from!.username || ctx.from!.first_name,
        taskText: '',
        gameId: game.id,
      },
    });

    ctx.reply(`✅ Ты присоединился к игре с кодом *${code}*! Введи своё задание.`);

  });
}
