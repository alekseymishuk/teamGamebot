import { Telegraf } from 'telegraf';
import { handleCreateGame } from './newGame';
import { handleComplete } from './complete';
import { handleStatus } from './status';
import { handleShowGames } from './games';

export function setupMenuActions(bot: Telegraf) {
  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    console.log('text', text);

    if (text.startsWith('/')) return; // не мешаем командам

    switch (text) {
      case '🎮 Создать игру':
        return handleCreateGame(ctx); // вызываем напрямую

      case '🔑 Присоединиться к игре':
        return ctx.reply('Введи /join_by_code');

      case '📋 Мои игры':
        return handleShowGames(ctx);

      case '📊 Статус':
        return handleStatus(ctx);

      case '✅ Выполнил задание':
        return handleComplete(ctx);

      case '🎯 Угадать задание':
        return ctx.reply('Напиши команду:\n/guess @username "задание"');
      
      case '🚪 Покинуть игру':
        return ctx.reply('Введи /leave_game, чтобы покинуть игру.');
    }
  });
}
