// src/commands/start.ts
import { Telegraf } from 'telegraf';
import { mainMenuKeyboard } from '../ui/mainMenu';

export function setupStart(bot: Telegraf) {
  bot.start((ctx) => {
    ctx.reply('Привет! Выбери действие:', mainMenuKeyboard);
  });
}
