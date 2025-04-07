import { Telegraf } from 'telegraf';

import { setupComplete } from './commands/complete';
import { setupGuess } from './commands/guess';
import { setupStartGame } from './commands/startGame';
import { setupEndGame } from './commands/endGame';
import { setupStatus } from './commands/status';
import { setupGames } from './commands/games';
import { setupJoinByCode } from './commands/joinByCode';
import { setupJoinManual } from './commands/joinManual';
import { setupNewGame } from './commands/newGame';
import { setupStart } from './commands/start';
import { setupMenuActions } from './commands/menuActions';


const bot = new Telegraf(process.env.BOT_TOKEN!);

// Подключаем команды

setupStart(bot);
setupMenuActions(bot);
setupComplete(bot);
setupGuess(bot);
setupStartGame(bot);
setupEndGame(bot);
setupStatus(bot);
setupGames(bot);
setupJoinByCode(bot);
setupJoinManual(bot);
setupNewGame(bot);


bot.launch();
console.log('🤖 Бот запущен...');
