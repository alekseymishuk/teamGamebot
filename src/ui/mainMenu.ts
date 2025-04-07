import { Markup } from 'telegraf';

export const mainMenuKeyboard = Markup.keyboard([
  ['🎮 Создать игру', '🔑 Ввести код'],
  ['📋 Мои игры', '📊 Статус'],
  ['✅ Выполнил задание', '🎯 Угадать задание'],
]).resize();
