import { Telegraf } from 'telegraf';
import { prisma } from '../db';
import { generateGameCode } from '../utils/generateGameCode'; // Assuming you have this utility function

export function setupNewGame(bot: Telegraf) {
  bot.command('new_game', async (ctx) => {
    const userId = ctx.from.id.toString();
    const username = ctx.from.username || ctx.from.first_name;

    console.log('👉 START от:', ctx.from.username);
  
    const code = generateGameCode();

    const game = await prisma.game.create({
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

    ctx.reply(
      `🆕 Игра создана!\nКод: *${code}*\nПоделись ссылкой с командой:\n` +
      `https://t.me/${bot.botInfo?.username}?start=${code}`,
      { parse_mode: 'Markdown' }
    );
  });
}
