import { Scenes, Markup } from 'telegraf';
import { BotContext } from '../types';
import { db } from '../db/client';

export const createTaskScene = new Scenes.WizardScene<BotContext>(
  'CREATE_TASK',

  async (ctx) => {
    await ctx.reply('Введіть назву завдання:');
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply('Надішліть текст.');
      return;
    }

    ctx.session.taskTitle = ctx.message.text;
    await ctx.reply('Вкажіть дедлайн (DD.MM.YYYY) або пропустіть:', 
      Markup.keyboard([['Пропустити']]).oneTime().resize()
    );
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (!ctx.message || !('text' in ctx.message)) return;

    const deadline = ctx.message.text === 'Пропустити'
      ? null
      : parseDate(ctx.message.text); // власна утиліта

    await db.task.create({
      data: {
        title: ctx.session.taskTitle!,
        deadline,
        createdBy: ctx.from!.id,
      },
    });

    await ctx.reply('Завдання створено!', Markup.removeKeyboard());
    return ctx.scene.leave();
  }
);

function parseDate(str: string): Date | null {
  const [d, m, y] = str.split('.').map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}