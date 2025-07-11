export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { webhookCallback } from "grammy";
import { bot } from "./bot";

// User Stuff
import "./callbackQuery/suggestion/button-click-handler";
import "../telegram/user/start";

// Admin Stuff
import "../telegram/payment/admin-response-handler"; // This will capture all 'CALLBACK QUERIES'
import "../telegram/news/share";
import "../telegram/admin/commands";

// Handle Suggestions
import "./callbackQuery/suggestion/handler"; // This will capture all 'MESSAGES'

export const POST = webhookCallback(bot, "std/http", {
    // onTimeout: "return",
    // timeoutMilliseconds: 100,
});
