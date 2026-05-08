import { Context, Scenes } from 'telegraf';

export interface SessionData extends Scenes.WizardSessionData {
  taskTitle?: string;
}

export type BotContext = Context & Scenes.WizardContext & {
  session: SessionData;
};