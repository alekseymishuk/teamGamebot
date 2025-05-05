import { Telegraf, Context } from 'telegraf';
import { prisma } from '../db';
import { generateGameCode } from '../utils/generateGameCode';
import { handleAddTask } from './addTask';

export async function handleCreateGame(ctx: Context) {
  const userId = ctx.from!.id.toString();
  const username = ctx.from!.username || ctx.from!.first_name;

  const code = generateGameCode();

  const existing = await prisma.participant.findUnique({
    where: { telegramId: userId },
  });

  if (existing) {
    return ctx.reply('Ты уже зарегистрирован в игре. Используй /games чтобы посмотреть список.');
  }

  await prisma.game.create({
    data: {
      code,
      participants: {
        create: {
          telegramId: userId,
          username,
          taskText: '',
          isAdmin: true,
        },
      },
    },
  });

  await ctx.reply(`🆕 Игра создана!\nКод: ${code}\nСсылка: https://t.me/${ctx.botInfo?.username}?start=${code}`);
  await ctx.reply(`👤 Ты — администратор этой игры.\n\nИспользуй /games чтобы посмотреть список игр.`);
  handleAddTask(ctx);

}


export function setupNewGame(bot: Telegraf) {
  bot.command('new_game', handleCreateGame);
}