import { Markup } from 'telegraf';

export const mainMenuKeyboard = Markup.keyboard([
  ['🎮 Создать игру', '🔑 Присоединиться к игре'],
  ['📋 Мои игры', '📊 Статус'],
  ['✅ Выполнил задание', '🎯 Угадать задание', '🚪 Покинуть игру'],
]).resize();
