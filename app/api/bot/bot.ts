import { Bot, session } from "grammy";
import { MyContext } from "./types";
import { BOT_API_HASH, BOT_API_ID, BOT_TOKEN } from "./cfg";
import { generateUpdateMiddleware } from "telegraf-middleware-console-time";

if (!BOT_TOKEN || !BOT_API_ID || !BOT_API_HASH) {
    throw new Error("ℹ️ BOT_TOKEN | TELEGRAM_BOT_API_ID | TELEGRAM_BOT_API_HASH алга...");
}

const bot = new Bot<MyContext>(BOT_TOKEN);
const pmBot = bot.chatType("private");

if (process.env.NODE_ENV === "development") {
    pmBot.use(generateUpdateMiddleware());
}

pmBot.use(session({ initial: () => ({ keys: [...Array(0)] }), prefix: "user-" }));

// bot is the raw bot, and pmBot is private chat bot... I think
export { bot, pmBot };
