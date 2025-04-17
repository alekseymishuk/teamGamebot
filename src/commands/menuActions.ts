import { Telegraf } from 'telegraf';
import { handleCreateGame } from './newGame';
import { handleComplete } from './complete';
import { handleStatus } from './status';
import { handleShowGames } from './games';
import { handleStartGame } from './startGame';
import { Menu } from '../constants/menu';
import { handleAddTask } from './addTask';
import { handleAllActions } from './admin/allActions';

export function setupMenuActions(bot: Telegraf) {
  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    console.log('text', text);

    if (text.startsWith('/')) return; // не мешаем командам

    switch (text) {
      case Menu.CREATE_GAME:
        return handleCreateGame(ctx); // вызываем напрямую

      case Menu.JOIN_GAME:
        return ctx.reply('Введи /join_by_code');

      case Menu.MY_GAMES:
        return handleShowGames(ctx);

      case Menu.STATUS:
        return handleStatus(ctx);

      case Menu.COMPLETE_TASK:
        return handleComplete(ctx);

      case Menu.GUESS_TASK:
        return ctx.reply('Напиши команду:\n/guess @username "задание"');

      case Menu.LEAVE_GAME:
        return ctx.reply('Введи /leave_game, чтобы покинуть игру.');

      case Menu.START_GAME:
        return handleStartGame(ctx);

      case Menu.ADD_GAME_TASK:
        return handleAddTask(ctx);

      case Menu.ADMIN_ALL_ACTIONS:
        return handleAllActions(ctx);
    }
  });
}
