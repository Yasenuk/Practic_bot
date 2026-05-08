import { Telegraf, Scenes, session } from 'telegraf';
import { createTaskScene } from './scenes/createTask';
import { BotContext } from './types';

export function createBot() {
  const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);

  const stage = new Scenes.Stage<BotContext>([createTaskScene]);

  bot.use(session());
  bot.use(stage.middleware());

  return bot;
}