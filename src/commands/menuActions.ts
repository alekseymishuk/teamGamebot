// src/commands/menuActions.ts
import { Telegraf } from 'telegraf';

export function setupMenuActions(bot: Telegraf) {
  bot.hears('🎮 Создать игру', async (ctx) => {
    return ctx.reply('Напиши /new_game, чтобы создать игру.');
  });

  bot.hears('🔑 Ввести код', async (ctx) => {
    return ctx.reply('Введи /join_by_code и следуй инструкциям.');
  });

  bot.hears('📋 Мои игры', async (ctx) => {
    return ctx.reply('Напиши /games, чтобы посмотреть список.');
  });

  bot.hears('📊 Статус', async (ctx) => {
    return ctx.reply('Для просмотра статуса напиши /status.');
  });

  bot.hears('✅ Выполнил задание', async (ctx) => {
    return ctx.reply('Если ты выполнил задание — напиши /complete.');
  });

  bot.hears('🎯 Угадать задание', async (ctx) => {
    return ctx.reply('Попробуй команду:\n/guess @username "текст задания"');
  });
}
