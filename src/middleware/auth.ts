import { BotContext } from '../types';

const ALLOWED_IDS = process.env.ALLOWED_USER_IDS?.split(',').map(Number) ?? [];

export async function authMiddleware(ctx: BotContext, next: () => Promise<void>) {
  if (!ctx.from || !ALLOWED_IDS.includes(ctx.from.id)) {
    await ctx.reply('Доступ заборонено.');
    return;
  }
  return next();
}