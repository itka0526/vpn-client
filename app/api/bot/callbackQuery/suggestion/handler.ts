import { config } from "@/lib/config";
import { pmBot } from "../../bot";
import { reportIssueText } from "../../menu";

pmBot.on("msg:text", async (ctx) => {
    try {
        await ctx.api.sendMessage(
            config.adminTelegramId,
            reportIssueText(
                ctx.message.from.username ? `@${ctx.message.from.username} [${ctx.message.from.id}]` : `Anonymous [${ctx.message.from.id}]`,
                ctx.message.text
            ),
            { parse_mode: "HTML" }
        );
    } catch (e) {
        console.error(e);
        await ctx.api.sendMessage(config.adminTelegramId, "Алдаа гарлаа... Мессеж илгээгдсэнгүй.");
    }
});
