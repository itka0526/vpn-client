import { config } from "@/lib/config";
import { pmBot } from "../../bot/bot";
import { extendBySetDays } from "../../bot/helper";
import prisma from "@/lib/db";
import { reportIssueText, tgDomain } from "../../bot/menu";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { BOT_API_HASH, BOT_API_ID, BOT_TOKEN } from "../../bot/cfg";
import { userInformation } from "./text";

pmBot.on("callback_query:data", async (ctx) => {
    try {
        const rawData = ctx.callbackQuery.data;
        const [command, email] = rawData.split("-$#");
        if (!command || !email) {
            throw Error("Invalid data! Cannot handle exception!");
        }

        const notifyUser = async () => {
            if (!email.endsWith(tgDomain)) {
                return await ctx.api.sendMessage(config.adminTelegramId, "🔕 Хэрэглэгч телеграмд бүртгэлгүй...");
            }
            const telegramUserId = email.split("@")[0];
            return await ctx.api.sendMessage(telegramUserId, "🔔 Админ хариу өглөө...");
        };

        switch (command) {
            case "30days":
                await extendBySetDays(email, 30);
                await notifyUser();
                return await ctx.api.sendMessage(config.adminTelegramId, "🥳 Амжилттай (30)");
            case "60days":
                await extendBySetDays(email, 60);
                await notifyUser();
                return await ctx.api.sendMessage(config.adminTelegramId, "🥳 Амжилттай (60)");
            case "90days":
                await extendBySetDays(email, 90);
                await notifyUser();
                return await ctx.api.sendMessage(config.adminTelegramId, "🥳 Амжилттай (90)");
            case "unblock":
                await prisma.user.update({ where: { email }, data: { banned: false } });
                return await ctx.api.sendMessage(config.adminTelegramId, "🥳 Амжилттай (UNBLOCK)");
            case "block":
                await prisma.user.update({ where: { email }, data: { banned: true } });
                return await ctx.api.sendMessage(config.adminTelegramId, "🥳 Амжилттай (BLOCK)");
            case "information":
                const user = await prisma.user.findUnique({ where: { email } });
                let tgUser = {};

                if (email?.endsWith(tgDomain)) {
                    await ctx.reply(`ℹ️ Telegram хэрэглэгчийг хайж байна...`, { parse_mode: "HTML" });
                    const stringSession = "";
                    const tgClient = new TelegramClient(new StringSession(stringSession), Number(BOT_API_ID), BOT_API_HASH, {
                        connectionRetries: 1,
                        requestRetries: 1,
                        reconnectRetries: 1,
                        downloadRetries: 1,
                    });
                    await tgClient.start({ botAuthToken: BOT_TOKEN });
                    const apiUser = await tgClient.invoke(
                        new Api.users.GetFullUser({
                            id: email.split("@")[0],
                        })
                    );
                    tgUser = { ...apiUser };
                }

                return await ctx.api.sendMessage(
                    config.adminTelegramId,
                    userInformation({ dbData: JSON.stringify(user, null, 2), tgData: JSON.stringify(tgUser, null, 2) }),
                    { parse_mode: "HTML" }
                );
        }
    } catch (error) {
        console.error(error);
        return await ctx.api.sendMessage(config.adminTelegramId, reportIssueText("Хэрэглэгчээс", `${error}`), { parse_mode: "HTML" });
    } finally {
        await ctx.answerCallbackQuery();
    }
});
