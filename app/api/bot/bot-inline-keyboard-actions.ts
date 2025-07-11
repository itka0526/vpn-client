import { config } from "@/lib/config";
import { InlineKeyboard } from "grammy";

export const botInlineKeyboardActions = new InlineKeyboard()
    .webApp("ЭХЛҮҮЛЭХ 📣⚙️", config.website)
    .row()
    .text("Санал хүсэлт 🚨📩", "USERSUGGESTIONS")
    .row();
