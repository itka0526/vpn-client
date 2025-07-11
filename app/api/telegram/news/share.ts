import { config } from "@/lib/config";
import { pmBot } from "../../bot/bot";
import prisma from "@/lib/db";
import { reportIssueText, tgDomain } from "../../bot/menu";

pmBot.command("news", async (ctx) => {
    await ctx.reply(
        `
📕 Run /news_add command to add news.
   The first line will be ignored, you can add additional flags such as '#silent'
   the rest of the content will
   be sent to all telegram users who are currently in database.
`,
        { parse_mode: "HTML" }
    );
});

pmBot.command("news_add", async (ctx) => {
    const rawData = ctx.message.text.split("\n");
    const content = rawData.slice(1).join("\n");

    try {
        const users =
            process.env.NODE_ENV === "production"
                ? await prisma.user.findMany({ where: { email: { endsWith: tgDomain } }, select: { email: true } })
                : [{ email: `${config.adminTelegramId}${tgDomain}` }];

        const userIds = users.map(({ email }) => Number(email.split("@")[0])).filter(Boolean);

        await ctx.api.sendMessage(config.adminTelegramId, `📢 Мэдээлэлийг ${userIds.length} хэрэглэгчидэд явуулж байна`);

        for (const userId of userIds) {
            try {
                await ctx.api.sendMessage(userId, content, {
                    disable_notification: rawData.includes("#silent"),
                    link_preview_options: {
                        show_above_text: true,
                        prefer_small_media: true,
                        url: "https://www.galvpn.com",
                    },
                });
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (err) {
                await ctx.api.sendMessage(config.adminTelegramId, reportIssueText(`${userId}${tgDomain}`, `❌ Алдаа гарлаа... ${err}`));
            }
        }

        await ctx.api.sendMessage(config.adminTelegramId, `✅ Мэдээлэл ${userIds.length} хэрэглэгчидэд очлоо.`);
    } catch (err) {
        await ctx.api.sendMessage(config.adminTelegramId, `❌ Мэдээлэл явсангүй... Алдаа гарлаа... ${err}`);
    }
});
