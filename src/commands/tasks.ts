import { Telegraf, Markup } from 'telegraf';
import { BotContext } from '../types';
import { db } from '../db/client';

export function registerTaskCommands(bot: Telegraf<BotContext>) {
  bot.command('tasks', async (ctx) => {
    const tasks = await db.task.findMany({
      where: { createdBy: ctx.from.id, done: false },
      take: 10,
    });

    if (!tasks.length) {
      return ctx.reply('Активних завдань немає.');
    }

    const text = tasks
      .map((t: any, i: any) => `${i + 1}. ${t.title}${t.deadline ? ` — ${fmt(t.deadline)}` : ''}`)
      .join('\n');

    await ctx.reply(`Ваші завдання:\n\n${text}`, 
      Markup.inlineKeyboard([
        Markup.button.callback('Нове завдання', 'task:new'),
      ])
    );
  });

  bot.action('task:new', (ctx) => ctx.scene.enter('CREATE_TASK'));
}

const fmt = (d: Date) => d.toLocaleDateString('uk-UA');