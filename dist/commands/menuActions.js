"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMenuActions = setupMenuActions;
const newGame_1 = require("./newGame");
const complete_1 = require("./complete");
const status_1 = require("./status");
const games_1 = require("./games");
const startGame_1 = require("./startGame");
const menu_1 = require("../constants/menu");
const addTask_1 = require("./addTask");
const allActions_1 = require("./admin/allActions");
function setupMenuActions(bot) {
    bot.on('text', async (ctx) => {
        const text = ctx.message.text;
        console.log('text', text);
        if (text.startsWith('/'))
            return; // не мешаем командам
        switch (text) {
            case menu_1.Menu.CREATE_GAME:
                return (0, newGame_1.handleCreateGame)(ctx); // вызываем напрямую
            case menu_1.Menu.JOIN_GAME:
                return ctx.reply('Введи /join_by_code');
            case menu_1.Menu.MY_GAMES:
                return (0, games_1.handleShowGames)(ctx);
            case menu_1.Menu.STATUS:
                return (0, status_1.handleStatus)(ctx);
            case menu_1.Menu.COMPLETE_TASK:
                return (0, complete_1.handleComplete)(ctx);
            case menu_1.Menu.GUESS_TASK:
                return ctx.reply('Напиши команду:\n/guess @username "задание"');
            case menu_1.Menu.LEAVE_GAME:
                return ctx.reply('Введи /leave_game, чтобы покинуть игру.');
            case menu_1.Menu.START_GAME:
                return (0, startGame_1.handleStartGame)(ctx);
            case menu_1.Menu.ADD_GAME_TASK:
                return (0, addTask_1.handleAddTask)(ctx);
            case menu_1.Menu.ADMIN_ALL_ACTIONS:
                return (0, allActions_1.handleAllActions)(ctx);
        }
    });
}
