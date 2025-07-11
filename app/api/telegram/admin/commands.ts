import { config } from "@/lib/config";
import { pmBot } from "../../bot/bot";
import prisma from "@/lib/db";
import { tgDomain, usersList } from "../../bot/menu";
import { extendBySetDays } from "../../bot/helper";
import { DataType } from "../../bot/types";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { BOT_API_HASH, BOT_API_ID, BOT_TOKEN } from "../../bot/cfg";
import { _downloadPhoto } from "telegram/client/downloads";
import { InputFile } from "grammy";

pmBot.command("users", async (ctx) => {
    if (`${ctx.from.id}` === config.adminTelegramId) {
        const users = await prisma.user.findMany({ select: { email: true }, orderBy: { createdAt: "asc" } });
        const list = "Хэрэглэгчид:\n" + `<blockquote expandable>${usersList(users)}</blockquote>`;
        return await ctx.reply(list, { parse_mode: "HTML" });
    } else {
        return await ctx.reply("👮 Та админ биш байна", { parse_mode: "HTML" });
    }
});

pmBot.command("user", async (ctx) => {
    if (`${ctx.from.id}` === config.adminTelegramId) {
        const rawMessage = ctx.message.text;
        const [userEmail] = rawMessage.split(" ").slice(1);
        const user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (!user) return await ctx.reply(`ℹ️ Хэрэглэгч олдсонгүй.`, { parse_mode: "HTML" });
        if (userEmail?.endsWith(tgDomain)) {
            const data: DataType = {};
            await ctx.reply(`ℹ️ Telegram хэрэглэгчийг хайж байна...`, { parse_mode: "HTML" });
            try {
                const stringSession = "";
                const tgClient = new TelegramClient(new StringSession(stringSession), Number(BOT_API_ID), BOT_API_HASH, {
                    connectionRetries: 3,
                });
                await tgClient.start({
                    botAuthToken: BOT_TOKEN,
                });
                const apiUser = await tgClient.invoke(
                    new Api.users.GetFullUser({
                        id: userEmail.split("@")[0],
                    })
                );
                if (apiUser?.users.length > 0) {
                    const fu = apiUser?.users[0] as DataType;
                    data["firstName"] = (fu?.firstName as string) ?? null;
                    data["lastName"] = (fu?.lastName as string) ?? null;
                    data["username"] = (fu?.username as string) ?? null;
                    data["phone"] = (fu?.phone as string) ?? null;
                    data["about"] = (apiUser?.fullUser?.about as string) ?? null;
                    data["birthday"] = apiUser?.fullUser?.birthday
                        ? (`${apiUser?.fullUser?.birthday.day}/${apiUser?.fullUser?.birthday.month}/${apiUser?.fullUser?.birthday.year}` as string)
                        : null;
                    data["hasPhoto"] = Boolean(apiUser?.fullUser?.profilePhoto);
                    if (apiUser?.fullUser?.profilePhoto) {
                        await ctx.replyWithChatAction("typing");
                        await ctx.reply(`ℹ️ Зураг татаж байна...`, { parse_mode: "HTML" });
                        const photoBuffer = await _downloadPhoto(tgClient, apiUser?.fullUser?.profilePhoto as Api.Photo);
                        const photo = new InputFile(Uint8Array.from(photoBuffer as Buffer), "profile.png");
                        await ctx.replyWithPhoto(photo);
                    }
                }
                await ctx.reply(`<code>${JSON.stringify({ ...user, data: { ...data } }, null, 2)}</code>`, { parse_mode: "HTML" });
            } catch (error) {
                if (!user) return await ctx.reply(`ℹ️ Алдаа: ${error}.`, { parse_mode: "HTML" });
            }
        } else {
            return await ctx.reply(`<code>${JSON.stringify(user, null, 2)}</code>`, { parse_mode: "HTML" });
        }
    } else {
        return await ctx.reply("👮 Та админ биш байна", { parse_mode: "HTML" });
    }
});

pmBot.command("extend", async (ctx) => {
    if (`${ctx.from.id}` === config.adminTelegramId) {
        const rawMessage = ctx.message.text;
        const [userEmail, days] = rawMessage.split(" ").slice(1);
        days ? await extendBySetDays(userEmail, Number(days)) : await extendBySetDays(userEmail, Number(31));
        return await ctx.reply("ℹ️ Амжилттай");
    } else {
        return await ctx.reply("👮 Та админ биш байна", { parse_mode: "HTML" });
    }
});
