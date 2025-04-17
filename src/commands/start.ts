// === start.ts ===
import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';
import { mainMenuKeyboard } from '../ui/mainMenu';
import { handleAddTask } from './addTask';


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
        ctx.reply(`👋 Ты уже в игре с кодом ${code}`);
        handleAddTask(ctx); // сразу переходим к добавлению задания
        return;
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


    ctx.reply(`✅ Ты присоединился к игре с кодом *${code}*!`);
    handleAddTask(ctx); // сразу переходим к добавлению задания
  });
}
