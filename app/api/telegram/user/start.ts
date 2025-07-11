import prisma from "@/lib/db";
import { pmBot } from "../../bot/bot";
import { mainText, reportIssueText, tgDomain } from "../../bot/menu";
import { botInlineKeyboardActions } from "../../bot/bot-inline-keyboard-actions";
import { generateRandomString } from "../../bot/helper";
import { config } from "@/lib/config";

pmBot.command("start", async (ctx) => {
    const loadingMessage = await ctx.reply("Уншиж байна... 🔄", { parse_mode: "HTML", disable_notification: true });
    const generatedEmail = `${ctx.from.id}${tgDomain}`;

    try {
        // If the user is already registered
        const searchingUser = await ctx.reply("Хэрэглэгчийг хайж байна... 🧑‍💻", { disable_notification: true });
        const user = await prisma.user.findUnique({
            where: { email: generatedEmail },
        });
        await ctx.deleteMessages([searchingUser.message_id]);
        // Just don't do anything?
        if (user) {
            ctx.session.keys = await prisma.key.findMany({ where: { userId: user.id }, select: { type: true, id: true, keyPath: true } });
            await ctx.deleteMessages([loadingMessage.message_id]);
            return await ctx.reply(mainText(user), {
                reply_markup: botInlineKeyboardActions,
                parse_mode: "HTML",
                link_preview_options: { show_above_text: true, prefer_small_media: true },
                disable_notification: true,
            });
        }
        // Else we create the user
        const password = generateRandomString();
        const registeringUser = await ctx.reply("Бүртгэж байна... 👤");
        const newUser = await prisma.user.create({
            data: { email: generatedEmail, password: password, userName: ctx.message.from.username ?? "Anonymous" },
        });
        await ctx.deleteMessages([registeringUser.message_id, loadingMessage.message_id]);
        // Respond back to the user
        await ctx.reply(mainText(newUser, true), {
            reply_markup: botInlineKeyboardActions,
            parse_mode: "HTML",
            disable_notification: true,
        });
        // Let the admin know that a new user has joined.
        return await ctx.api.sendMessage(
            config.adminTelegramId,
            reportIssueText(
                ctx.message.from.username ? `@${ctx.message.from.username} [${ctx.message.from.id}]` : `Anonymous [${ctx.message.from.id}]`,
                `ℹ️ Шинэ хэрэглэгч нэмэгдлээ...`
            ),
            { parse_mode: "HTML", disable_notification: true }
        );
    } catch (error) {
        console.error(error);
        await ctx.api.sendMessage(
            config.adminTelegramId,
            reportIssueText(
                ctx.message.from.username ? `@${ctx.message.from.username} [${ctx.message.from.id}]` : `Anonymous [${ctx.message.from.id}]`,
                `${error}`
            ),
            { parse_mode: "HTML" }
        );
        await ctx.deleteMessages([loadingMessage.message_id]);
        return await ctx.reply("Бүртгэл амжилтгүй. ❌\n/start");
    }
});
