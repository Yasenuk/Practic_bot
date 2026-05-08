import 'dotenv/config';
import express from 'express';
import { createBot } from './bot';
import { db } from './db/client';

async function main() {
  await db.$connect();
  const bot = createBot();

  if (process.env.NODE_ENV === 'production') {
    const app = express();
    app.use(express.json());

    const webhookUrl = `${process.env.WEBHOOK_URL}/webhook`;
    await bot.telegram.setWebhook(webhookUrl);

    app.use('/webhook', bot.webhookCallback('/webhook'));

    app.listen(3000, () => console.log('Server running on port 3000'));
    console.log(`Webhook set: ${webhookUrl}`);
  } else {
    bot.launch();
    console.log('Bot started (polling)');
  }

  process.once('SIGINT', () => { bot.stop(); db.$disconnect(); });
  process.once('SIGTERM', () => { bot.stop(); db.$disconnect(); });
}

main();