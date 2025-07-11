import { pmBot } from "../../bot";
import { askText } from "../../menu";

pmBot.callbackQuery("USERSUGGESTIONS", async (ctx) => {
    await ctx.reply(askText, {
        parse_mode: "HTML",
        link_preview_options: { prefer_large_media: true },
        disable_notification: true,
    });
    await ctx.answerCallbackQuery();
});
