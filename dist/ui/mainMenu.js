"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainMenuKeyboard = void 0;
const telegraf_1 = require("telegraf");
const menu_1 = require("../constants/menu");
exports.mainMenuKeyboard = telegraf_1.Markup.keyboard([
    [menu_1.Menu.CREATE_GAME, menu_1.Menu.JOIN_GAME, menu_1.Menu.START_GAME],
    [menu_1.Menu.MY_GAMES, menu_1.Menu.STATUS, menu_1.Menu.ADD_GAME_TASK],
    [menu_1.Menu.COMPLETE_TASK, menu_1.Menu.GUESS_TASK, menu_1.Menu.LEAVE_GAME],
    [menu_1.Menu.ADMIN_ALL_ACTIONS]
]).resize();
