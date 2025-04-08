// === start.ts ===
import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';
import { mainMenuKeyboard } from '../ui/mainMenu';
import { Message } from 'telegraf/typings/core/types/typegram';

const waitingForTask = new Set<string>();

export function setupStart(bot: Telegraf) {
  bot.start(async (ctx) => {
    const userId = ctx.from!.id.toString();
    const username = ctx.from!.username || ctx.from!.first_name;
    const code = ctx.startPayload?.trim().toUpperCase();

    if (!code) {
      return ctx.reply('Привет! Добро пожаловать 👋\nИспользуй кнопки ниже:', mainMenuKeyboard);
    }

    const game = await prisma.game.findUnique({ where: { code } });
    if (!game) {
      return ctx.reply('⛔ Игра с таким кодом не найдена. Проверь ссылку или код.');
    }

    const existing = await prisma.participant.findFirst({
      where: {
        telegramId: userId,
        gameId: game.id,
      },
    });

    if (existing) {
      if (!existing.taskText || existing.taskText.trim() === '') {
        waitingForTask.add(userId);
        return ctx.reply(`👋 Ты уже в игре с кодом ${code}, но ещё не ввёл задание. Пожалуйста, напиши его сейчас.`);
      } else {
        return ctx.reply(`👋 С возвращением в игру с кодом ${code}!`, mainMenuKeyboard);
      }
    }

    // добавляем участника в игру
    await prisma.participant.create({
      data: {
        telegramId: userId,
        username,
        taskText: '',
        isAdmin: false,
        gameId: game.id,
      },
    });

    waitingForTask.add(userId);

    ctx.reply(`✅ Ты присоединился к игре с кодом *${code}*!\nНапиши задание, которое должен будет выполнить другой участник.`, {
      parse_mode: 'Markdown',
    });
  });

  bot.use(async (ctx, next) => {
    const userId = ctx.from?.id.toString();
    const message = ctx.message as Message.TextMessage | undefined;

    if (!message || !userId) return next();

    const text = message.text.trim();

    if (!waitingForTask.has(userId)) return next();

    if (text.startsWith('/')) {
      waitingForTask.delete(userId);
      return next();
    }

    const participant = await prisma.participant.findUnique({ where: { telegramId: userId } });
    if (!participant) return next();

    await prisma.participant.update({
      where: { telegramId: userId },
      data: { taskText: text },
    });

    waitingForTask.delete(userId);
    ctx.reply('📝 Задание сохранено! Ожидай начала игры.', mainMenuKeyboard);
  });
}
