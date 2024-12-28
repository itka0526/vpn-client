export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

import { Bot, session, webhookCallback } from "grammy";
import prisma from "@/lib/db";
import { randomBytes } from "crypto";
import { Menu, MenuRange } from "@grammyjs/menu";
import {
    androidInstructionsText,
    connectText,
    goBackToMain,
    iosInstructionsText,
    macosInstructionsText,
    mainText,
    paymentText,
    tgDomain,
    windowsInstructionsText,
} from "./menu";
import { config } from "@/lib/config";
import { createHiddifyKey, HIDDIFY_API_ADMIN_BASE_URL, HIDDIFY_API_USER_BASE_URL, HiddifyKeyResponseType } from "./hiddify";
import { MyContext } from "./types";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

const main = new Menu<MyContext>("main-menu")
    .submenu("Холболт 🔌📱", "connect-menu", async (ctx) => await ctx.editMessageText(connectText, { parse_mode: "HTML" }))
    .row()
    .submenu(
        "Төлбөр төлөх 📲💳",
        "payment-menu",
        async (ctx) => await ctx.editMessageText(paymentText(`${ctx.from.id}${tgDomain}`), { parse_mode: "HTML" })
    );

const bot = new Bot<MyContext>(token);
const pmBot = bot.chatType("private");

pmBot.use(session({ initial: () => ({ keys: [...Array(0)] }), prefix: "user-" }));

const connect = new Menu<MyContext>("connect-menu", {})
    .dynamic(async (ctx) => {
        if (!ctx.from) return;
        const keys = ctx.session.keys;
        const range = new MenuRange<MyContext>();
        for (let i = 0; i < keys.length; i++) {
            const vpnType = keys[i].type;
            const displayName = `Түлхүүр (${vpnType.toString()}) ${i + 1} 🗝️`;
            range.copyText(displayName, keys[i].keyPath).row();
        }
        return range;
    })
    .submenu("iOS 🍎📱", "instructions", async (ctx) => await ctx.editMessageText(iosInstructionsText))
    .submenu("Android 🤖📱", "instructions", async (ctx) => await ctx.editMessageText(androidInstructionsText))
    .row()
    .submenu("Windows 🪟💻", "instructions", async (ctx) => await ctx.editMessageText(windowsInstructionsText))
    .submenu("macOS 🍏💻", "instructions", async (ctx) => await ctx.editMessageText(macosInstructionsText))
    .row()
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
            return await ctx.editMessageText(connectText + "\n<b>🚫 Одоогоор түлхүүр үүсгэж болохгүй байна...</b>", { parse_mode: "HTML" });
        }
    })
    .row()
    .back("Үндсэн цэс рүү буцах ⬅️", goBackToMain);
const payment = new Menu<MyContext>("payment-menu").back("Үндсэн цэс рүү буцах ⬅️", goBackToMain);

const instructions = new Menu<MyContext>("instructions").back("Холбох цэс руу буцах ⬅️", async (ctx) => await ctx.editMessageText(connectText));

main.register(connect);
main.register(payment);

connect.register(instructions);
pmBot.use(main);

pmBot.command("start", async (ctx) => {
    const loadingMessage = await ctx.reply("Уншиж байна... 🔄");
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
            return await ctx.reply(mainText(user), { reply_markup: main, parse_mode: "HTML" });
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
        await ctx.deleteMessages([loadingMessage.message_id]);
        return await ctx.reply("Бүртгэл амжилтгүй. ❌\n/start");
    }
});

pmBot.errorBoundary(async (err) => {
    return await err.ctx.reply(`${err.error}`);
});

export const POST = webhookCallback(bot, "std/http", {
    // onTimeout: "return",
    // timeoutMilliseconds: 100,
});
