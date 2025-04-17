import { Markup } from 'telegraf';
import { Menu } from '../constants/menu';

export const mainMenuKeyboard = Markup.keyboard([
  [Menu.CREATE_GAME, Menu.JOIN_GAME, Menu.START_GAME],
  [Menu.MY_GAMES, Menu.STATUS, Menu.ADD_GAME_TASK],
  [Menu.COMPLETE_TASK, Menu.GUESS_TASK, Menu.LEAVE_GAME],
  [Menu.ADMIN_ALL_ACTIONS]
]).resize();
