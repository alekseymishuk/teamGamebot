import { Context, Telegraf } from "telegraf";

export function handleAllActions(ctx: Context) {
    ctx.reply(
        "Вот все доступные команды:\n\n" +
        "/new_game - Создать новую игру\n" +
        "/join_by_code - Присоединиться к игре по коду\n" +
        "/games - Посмотреть список своих игр\n" +
        "/status - Проверить статус игры\n" +
        "/add_task - Добавить задание в игру\n" +
        "/edit_task - Изменить задание\n" +
        "/complete_task - Завершить задание\n" +
        "/guess_task - Угадать задание\n" +
        "/leave_game - Выйти из игры\n" +
        "/delete_game - Удалить игру\n" +
        "/start_game - Запустить игру\n" +
        "/participants - Список участников\n" +
        "/end_game - Завершить игру\n" +
        "/help - Получить помощь\n"
    );
}

export function setupAllActions(bot: Telegraf) {
    bot.command("all_actions", handleAllActions);
}