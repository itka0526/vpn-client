export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

import { Bot, session, webhookCallback } from "grammy";
import prisma from "@/lib/db";
import { randomBytes } from "crypto";
import { Menu, MenuRange } from "@grammyjs/menu";
import {
    androidInstructionsText,
    askText,
    connectText,
    goBackToMain,
    iosInstructionsText,
    iPaidMessage,
    macosInstructionsText,
    mainText,
    paymentText,
    reportIssueText,
    tgDomain,
    usersList,
    windowsInstructionsText,
} from "./menu";
import { config } from "@/lib/config";
import { createHiddifyKey, HIDDIFY_API_USER_BASE_URL } from "./hiddify";
import { MyContext } from "./types";
import { extendByOneMonth, extendBySetDays } from "./helper";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

const main = new Menu<MyContext>("main-menu")
    .submenu("Холболт 🔌📱", "connect-menu", async (ctx) => await ctx.editMessageText(connectText, { parse_mode: "HTML" }))
    .row()
    .submenu(
        "Төлбөр төлөх 📲💳",
        "payment-menu",
        async (ctx) => await ctx.editMessageText(paymentText(`${ctx.from.id}${tgDomain}`), { parse_mode: "HTML" })
    )
    .row()
    .text(
        "Санал хүсэлт 🚨📩",
        async (ctx) =>
            await ctx.reply(askText, {
                parse_mode: "HTML",
                link_preview_options: { prefer_large_media: true },
            })
    )
    .row();

const bot = new Bot<MyContext>(token);
const pmBot = bot.chatType("private");

pmBot.use(session({ initial: () => ({ keys: [...Array(0)] }), prefix: "user-" }));

const connect = new Menu<MyContext>("connect-menu", {})
    .submenu("iOS 🍎📱", "instructions", async (ctx) => await ctx.editMessageText(iosInstructionsText, { parse_mode: "HTML" }))
    .submenu("Android 🤖📱", "instructions", async (ctx) => await ctx.editMessageText(androidInstructionsText, { parse_mode: "HTML" }))
    .row()
    .submenu("Windows 🪟💻", "instructions", async (ctx) => await ctx.editMessageText(windowsInstructionsText, { parse_mode: "HTML" }))
    .submenu("macOS 🍏💻", "instructions", async (ctx) => await ctx.editMessageText(macosInstructionsText, { parse_mode: "HTML" }))
    .row()
    .dynamic(async (ctx) => {
        if (!ctx.from) return;
        const keys = ctx.session.keys;
        const range = new MenuRange<MyContext>();
        if (keys.length >= 1) range.text("------------------------").row();
        for (let i = 0; i < keys.length; i++) {
            const vpnType = keys[i].type;
            const displayName = `Миний түлхүүр (${vpnType.toString()}) ${i + 1} 🗝️`;
            range.copyText(displayName, keys[i].keyPath).row();
        }
        if (keys.length >= 1) range.text("------------------------").row();
        return range;
    })
    .text("Түлхүүр үүсгэх 🔑", async (ctx) => {
        await ctx.editMessageText(connectText + "\n<b>⏳ Та түр хүлээнэ үү...</b>", { parse_mode: "HTML" });
        const dbRes = await prisma.user.findUnique({
            where: { email: `${ctx.from.id}${tgDomain}` },
            select: { banned: true, activeTill: true, _count: { select: { keys: true } } },
        });
        if (!dbRes) {
            return await ctx.editMessageText(connectText + "\n<b>🚫 Өгөгдлийн санд алдаа гарлаа.</b>", { parse_mode: "HTML" });
        }
        const { _count, banned, activeTill } = dbRes;
        if (activeTill < new Date()) {
            return await ctx.editMessageText(connectText + "\n<b>⚠️ Та төлбөрөө төлнө үү.</b>", { parse_mode: "HTML" });
        }
        if (banned) {
            return await ctx.editMessageText(connectText + "\n<b>⚠️ Таны хаяг блоклогдсон байна.</b>", { parse_mode: "HTML" });
        }
        if (_count.keys >= config.deviceLimitPerAcc) {
            return await ctx.editMessageText(
                connectText + `\n<b>⚠️ Түлхүүрний хязгаар хэтэрсэн байна: (${_count.keys}/${config.deviceLimitPerAcc})</b>`,
                { parse_mode: "HTML" }
            );
        }
        try {
            await ctx.editMessageText(connectText + "\n<b>⏳ Шинэ түлхүүр үүсгэж байна...</b>", { parse_mode: "HTML" });
            const key = await createHiddifyKey(ctx.from.id, `key_${ctx.from.id}_${_count.keys}`);
            const {
                user: { keys: dbkeys },
            } = await prisma.key.create({
                data: {
                    user: { connect: { email: `${ctx.from.id}${tgDomain}` } },
                    type: "HiddifyVPN",
                    keyPath: HIDDIFY_API_USER_BASE_URL.toString() + `/${key.uuid}`,
                    secret: JSON.stringify(key),
                },
                select: { user: { select: { keys: { select: { id: true, type: true, keyPath: true } } } } },
            });
            ctx.session.keys = [...dbkeys];
            ctx.menu.update();
            return await ctx.editMessageText(
                connectText + "\n<b>🎉 Одоо уг түлхүүрийг ашиглахын тулд үүсгэсэн холбоосыг хуулж, татсан програм руугаа хуулна уу.</b>",
                { parse_mode: "HTML" }
            );
        } catch (error) {
            console.error(error);
            await ctx.api.sendMessage(
                config.adminTelegramId,
                reportIssueText(ctx.from.username ? `@${ctx.from.username} [${ctx.from.id}]` : `Anonymous [${ctx.from.id}]`, `${error}`),
                { parse_mode: "HTML" }
            );
            return await ctx.editMessageText(connectText + "\n<b>🚫 Одоогоор түлхүүр үүсгэж болохгүй байна...</b>", { parse_mode: "HTML" });
        }
    })
    .text("Түлхүүрнүүд 🔄", async (ctx) => {
        try {
            await ctx.editMessageText(connectText + "\n⏳ <b>Таны түлхүүрнүүдийг хайж байна...</b>", { parse_mode: "HTML" });
            ctx.session.keys = await prisma.key.findMany({
                where: { user: { email: `${ctx.from.id}${tgDomain}` } },
                select: { type: true, id: true, keyPath: true },
            });
            ctx.menu.update();
            return await ctx.editMessageText(connectText + `\n<b>📅 Шинэчлэгдсэн огноо: ${new Date().toLocaleTimeString()}</b>`, {
                parse_mode: "HTML",
            });
        } catch (err) {
            return await ctx.editMessageText(connectText + `\n<b>👨‍💻 Алдаа гарлаа... Хөгжүүлэгчтэй холбоо барина уу</b>`, { parse_mode: "HTML" });
        }
    })

    .row()
    .back("Үндсэн цэс рүү буцах ⬅️", goBackToMain);
const payment = new Menu<MyContext>("payment-menu")
    .text("💰 Би төлсөн", async (userCtx) => {
        await userCtx.api.sendMessage(
            config.adminTelegramId,
            iPaidMessage(
                userCtx.from.username ? `@${userCtx.from.username} [${userCtx.from.id}]` : `Anonymous [${userCtx.from.id}]`,
                `Хэрэглэгч төлбөр төллөө... (${new Date().toLocaleString()})`
            ),
            { parse_mode: "HTML" }
        );
    })
    .row()
    .back("Үндсэн цэс рүү буцах ⬅️", goBackToMain);

const instructions = new Menu<MyContext>("instructions").back(
    "Холбох цэс руу буцах ⬅️",
    async (ctx) => await ctx.editMessageText(connectText, { parse_mode: "HTML" })
);

main.register(connect);
main.register(payment);

connect.register(instructions);
pmBot.use(main);

pmBot.command("start", async (ctx) => {
    const loadingMessage = await ctx.reply("Уншиж байна... 🔄", { parse_mode: "HTML" });
    const generatedEmail = `${ctx.from.id}${tgDomain}`;

    try {
        // If the user is already registered
        const searchingUser = await ctx.reply("Хэрэглэгчийг хайж байна... 🧑‍💻");
        const user = await prisma.user.findUnique({
            where: { email: generatedEmail },
        });
        await ctx.deleteMessages([searchingUser.message_id]);
        // Just don't do anything?
        if (user) {
            ctx.session.keys = await prisma.key.findMany({ where: { userId: user.id }, select: { type: true, id: true, keyPath: true } });
            await ctx.deleteMessages([loadingMessage.message_id]);
            return await ctx.reply(mainText(user), {
                reply_markup: main,
                parse_mode: "HTML",
                link_preview_options: { show_above_text: true, prefer_small_media: true },
            });
        }
        // Else we create the user
        const password = `${randomBytes(5).toString("hex")}`;
        const registeringUser = await ctx.reply("Бүртгэж байна... 👤");
        const newUser = await prisma.user.create({ data: { email: generatedEmail, password: password } });
        await ctx.deleteMessages([registeringUser.message_id, loadingMessage.message_id]);
        // Respond back to the user
        return await ctx.reply(mainText(newUser, true), { reply_markup: main, parse_mode: "HTML" });
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

pmBot.errorBoundary(async (err) => {
    return await err.ctx.reply(`${err.error}`);
});

pmBot.filter(
    async (ctx) => {
        return `${ctx.from.id}` === config.adminTelegramId;
    },
    async (ctx) => {
        if (ctx.message?.text) {
            if (ctx.message.text.startsWith("/users")) {
                const users = await prisma.user.findMany({ select: { email: true } });
                const list = "Хэрэглэгчид:\n" + usersList(users);
                await ctx.reply(list);
            } else if (ctx.message.text.startsWith("/extend")) {
                const rawMessage = ctx.message.text;
                const [command, userEmail, days] = rawMessage.split(" ");
                console.log(command);
                days ? await extendBySetDays(userEmail, Number(days)) : await extendByOneMonth(userEmail);
                await ctx.reply("ℹ️ Амжилттай");
            } else {
                await ctx.reply(`
Командууд:

# Хэрэглэгчидийн нэрсийн жагсалт
/users

# Сунгах - extend userEmail dayToAdd
/extend
            `);
            }
        }
    }
);

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

export const POST = webhookCallback(bot, "std/http", {
    onTimeout: "return",
    timeoutMilliseconds: 100,
});
