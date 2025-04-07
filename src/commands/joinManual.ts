import { Telegraf } from 'telegraf';
import { prisma } from '../db';

const waitingForCode = new Set<string>();

export function setupJoinManual(bot: Telegraf) {
  bot.command('join_by_code', (ctx) => {
    waitingForCode.add(ctx.from.id.toString());
    ctx.reply('Введи код игры, чтобы присоединиться:');
  });

  bot.on('text', async (ctx) => {
    const userId = ctx.from.id.toString();

    // если бот не ждал код — игнорируем
    if (!waitingForCode.has(userId)) return;

    const code = ctx.message.text.trim().toUpperCase();
    waitingForCode.delete(userId); // убираем ожидание

    const game = await prisma.game.findUnique({ where: { code } });
    if (!game) return ctx.reply('Игра с таким кодом не найдена.');

    const exists = await prisma.participant.findUnique({
      where: { telegramId: userId },
    });

    if (exists) return ctx.reply('Ты уже участвуешь в игре.');

    await prisma.participant.create({
      data: {
        telegramId: userId,
        username: ctx.from.username || ctx.from.first_name,
        taskText: '',
        gameId: game.id,
      },
    });

    ctx.reply(`✅ Ты присоединился к игре с кодом *${code}*! Введи своё задание.`, {
      parse_mode: 'Markdown',
    });
  });
}
