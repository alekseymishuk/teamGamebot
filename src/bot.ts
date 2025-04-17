import { Telegraf } from 'telegraf';
import 'dotenv/config';

import { setupStart } from './commands/start';
import { setupNewGame } from './commands/newGame';
import { setupJoinManual } from './commands/joinManual';
import { setupJoinByCode } from './commands/joinByCode';
import { setupComplete } from './commands/complete';
import { setupGuess } from './commands/guess';
import { setupStartGame } from './commands/startGame';
import { setupEndGame } from './commands/endGame';
import { setupStatus } from './commands/status';
import { setupGames } from './commands/games';
import { setupMenuActions } from './commands/menuActions';
import { setupGameManagement } from './commands/gameManagement';
import { setupAddTask } from './commands/addTask';
import { setupAllActions } from './commands/admin/allActions';

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Команды
setupStart(bot);
setupNewGame(bot);
setupGames(bot);
setupJoinManual(bot);
setupJoinByCode(bot);
setupComplete(bot);
setupGuess(bot);
setupStartGame(bot);
setupEndGame(bot);
setupStatus(bot);
setupGameManagement(bot);
setupAddTask(bot);
setupAllActions(bot);



// Обработка кнопок внизу — обязательно в КОНЦЕ
setupMenuActions(bot);

bot.launch();
console.log('🤖 Бот запущен...');
