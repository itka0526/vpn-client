export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

import { Bot, InputFile, session, webhookCallback } from "grammy";
import prisma from "@/lib/db";
import { Menu, MenuRange } from "@grammyjs/menu";
import {
    adminCommands,
    androidInstructionsTextHiddify,
    askText,
    connectTextHiddify,
    connectTextWireguard,
    connectWrapperText,
    desktopInstructionsTextWireguard,
    goBackToConnectWrapper,
    goBackToMain,
    iosInstructionsTextHiddify,
    iPaidMessage,
    macosInstructionsTextHiddify,
    mainText,
    mobileInstructionsTextWireguard,
    paymentText,
    reportIssueText,
    tgDomain,
    usersList,
    windowsInstructionsTextHiddify,
    wireguarConfigText,
} from "./menu";
import { config } from "@/lib/config";
import { createHiddifyKey, HIDDIFY_API_USER_BASE_URL } from "./hiddify";
import { MyContext } from "./types";
import {
    checkUser,
    deleteMoreRecentMessages,
    extendByOneMonth,
    extendBySetDays,
    generateRandomString,
    getAllKeys,
    retrieveLastAccessedKey,
} from "./helper";
import { VPNType } from "@prisma/client";
import { createNewKeyWgOrOv } from "../keys/route";
import QRCode from "qrcode";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { _downloadPhoto } from "telegram/client/downloads";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) throw new Error("ℹ️ TELEGRAM_BOT_TOKEN environment variable not found.");

const BOT_TOKEN = process?.env?.TELEGRAM_BOT_TOKEN || "";
const BOT_API_ID = process?.env?.TELEGRAM_BOT_API_ID || "";
const BOT_API_HASH = process?.env?.TELEGRAM_BOT_API_HASH || "";

if (!BOT_TOKEN || !BOT_API_ID || !BOT_API_HASH) {
    throw new Error("ℹ️ BOT_TOKEN | TELEGRAM_BOT_API_ID | TELEGRAM_BOT_API_HASH алга...");
}

const main = new Menu<MyContext>("main-menu")
    .submenu("Холболт 🔌📱", "connect-wrapper", async (ctx) => await ctx.editMessageText(connectWrapperText, { parse_mode: "HTML" }))
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
                disable_notification: true,
            })
    )
    .row();

const bot = new Bot<MyContext>(token);
const pmBot = bot.chatType("private");

pmBot.use(session({ initial: () => ({ keys: [...Array(0)] }), prefix: "user-" }));

const connectHiddify = new Menu<MyContext>("connect-menu-hiddify", {})
    .submenu("iOS 🍎📱", "instructions-hiddify", async (ctx) => await ctx.editMessageText(iosInstructionsTextHiddify, { parse_mode: "HTML" }))
    .submenu("Android 🤖📱", "instructions-hiddify", async (ctx) => await ctx.editMessageText(androidInstructionsTextHiddify, { parse_mode: "HTML" }))
    .row()
    .submenu("Windows 🪟💻", "instructions-hiddify", async (ctx) => await ctx.editMessageText(windowsInstructionsTextHiddify, { parse_mode: "HTML" }))
    .submenu("macOS 🍏💻", "instructions-hiddify", async (ctx) => await ctx.editMessageText(macosInstructionsTextHiddify, { parse_mode: "HTML" }))
    .row()
    .dynamic(async (ctx) => {
        if (!ctx.from) return;
        const keys = ctx.session.keys.filter(({ type }) => type === VPNType.HiddifyVPN);
        const range = new MenuRange<MyContext>();
        if (keys.length >= 1) range.text("➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖").row();
        for (let i = 0; i < keys.length; i++) {
            const vpnType = keys[i].type;
            const displayName = `Hiddify түлхүүр (${vpnType.toString()}) ${i + 1} 🗝️`;
            range.copyText(displayName, keys[i].keyPath).row();
        }
        if (keys.length >= 1) range.text("➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖").row();
        return range;
    })
    .text("Түлхүүр үүсгэх 🔑", async (ctx) => {
        await checkUser(ctx, connectTextHiddify);
        try {
            await ctx.editMessageText(connectTextHiddify + "\n<b>⏳ Шинэ түлхүүр үүсгэж байна...</b>", { parse_mode: "HTML" });
            const key = await createHiddifyKey(ctx.from.id, `key_${ctx.from.id}_${generateRandomString(3)}`);
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
                connectTextHiddify + "\n<b>🎉 Одоо уг түлхүүрийг ашиглахын тулд үүсгэсэн холбоосыг хуулж, татсан програм руугаа хуулна уу.</b>",
                { parse_mode: "HTML" }
            );
        } catch (error) {
            console.error(error);
            await ctx.api.sendMessage(
                config.adminTelegramId,
                reportIssueText(ctx.from.username ? `@${ctx.from.username} [${ctx.from.id}]` : `Anonymous [${ctx.from.id}]`, `${error}`),
                { parse_mode: "HTML" }
            );
            return await ctx.editMessageText(connectTextHiddify + "\n<b>🚫 Одоогоор түлхүүр үүсгэж болохгүй байна...</b>", { parse_mode: "HTML" });
        }
    })
    .text("Түлхүүрнүүд 🔄", async (ctx) => await getAllKeys(ctx, connectTextHiddify))
    .row()
    .back("Холболтын цэс рүү буцах ⬅️", goBackToConnectWrapper);

const connectWireguard = new Menu<MyContext>("connect-menu-wireguard")
    .submenu(
        "iOS 🍎📱 / Android 🤖📱",
        "instructions-wireguard",
        async (ctx) => await ctx.editMessageText(mobileInstructionsTextWireguard, { parse_mode: "HTML" })
    )
    .row()
    .submenu(
        "Windows 🪟💻 / macOS 🍏💻",
        "instructions-wireguard",
        async (ctx) => await ctx.editMessageText(desktopInstructionsTextWireguard, { parse_mode: "HTML" })
    )
    .row()
    .dynamic(async (ctx) => {
        if (!ctx.from) return;
        const keys = ctx.session.keys.filter(({ type }) => type === VPNType.WireGuardVPN);
        const range = new MenuRange<MyContext>();
        if (keys.length >= 1) range.text("➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖").row();
        for (let i = 0; i < keys.length; i++) {
            const vpnType = keys[i].type;
            const displayName = `WireGuard түлхүүр (${vpnType.toString()}) ${i + 1} 🗝️`;
            range
                .submenu(displayName, "wireguard-config-menu", async (ctx) => {
                    try {
                        await prisma.lastAccessedKey.upsert({
                            // If lastAccessedKey does not exist create one
                            create: {
                                userEmail: `${ctx.from.id}${tgDomain}`,
                                keyId: keys[i].id,
                            },
                            // Update the key
                            where: { userEmail: `${ctx.from.id}${tgDomain}` },
                            update: {
                                keyId: keys[i].id,
                            },
                        });
                        await ctx.editMessageText(wireguarConfigText, { parse_mode: "HTML" });
                    } catch (error) {
                        await ctx.editMessageText(wireguarConfigText + "<b>⏳ Дахин оролдоно уу...</b>", { parse_mode: "HTML" });
                        ctx.menu.back();
                    }
                })
                .row();
        }
        if (keys.length >= 1) range.text("➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖").row();
        return range;
    })
    .text("Түлхүүр үүсгэх 🔑", async (ctx) => {
        await checkUser(ctx, connectTextWireguard);
        try {
            await ctx.editMessageText(connectTextWireguard + "\n<b>⏳ Шинэ түлхүүр үүсгэж байна...</b>", { parse_mode: "HTML" });
            try {
                const { wgAddr, wgCreds } = createNewKeyWgOrOv.checkServerEnv();
                const resp = await createNewKeyWgOrOv.toRawServer(wgAddr, wgCreds);
                const data = await resp.text();
                const res = await createNewKeyWgOrOv.writeToDb(data, `${ctx.from.id}${tgDomain}`, "WireGuardVPN");
                if (res.status) {
                    await getAllKeys(ctx, connectTextWireguard);
                    return await ctx.editMessageText(
                        connectTextWireguard +
                            "\n<b>🎉 Одоо уг түлхүүрийг ашиглахын тулд үүсгэсэн түлхүүрийг WireguardVPN аппын QR код сканнераар уншуулна уу эсвэл татаж оруулна уу.</b>",
                        { parse_mode: "HTML" }
                    );
                } else {
                    throw new Error("🛑 Сан руу түлхүүрийг бүртгэж чадсангүй...");
                }
            } catch (error) {
                await ctx.editMessageText(connectTextWireguard + "\n<b>🛑 Түлхүүр үүсгэлт амжилтгүй...</b>", { parse_mode: "HTML" });
                throw new Error("🛑 Түлхүүр үүсгэлт амжилтгүй... WireguardVPN");
            }
        } catch (error) {
            console.error(error);
            await ctx.api.sendMessage(
                config.adminTelegramId,
                reportIssueText(ctx.from.username ? `@${ctx.from.username} [${ctx.from.id}]` : `Anonymous [${ctx.from.id}]`, `${error}`),
                { parse_mode: "HTML" }
            );
            return await ctx.editMessageText(connectTextWireguard + "\n<b>🚫 Одоогоор түлхүүр үүсгэж болохгүй байна...</b>", { parse_mode: "HTML" });
        }
    })
    .text("Түлхүүрнүүд 🔄", async (ctx) => await getAllKeys(ctx, connectTextWireguard))
    .row()
    .back("Холболтын цэс рүү буцах ⬅️", goBackToConnectWrapper);

const wireguardConfigMenu = new Menu<MyContext>("wireguard-config-menu", { onMenuOutdated: true })
    .dynamic(async () => {
        const range = new MenuRange<MyContext>();
        range
            .text("🟢 QR код", async (ctx) => {
                await ctx.editMessageText(wireguarConfigText + "<b>⏳ Түр хүлээнэ үү... (QR)</b>", {
                    parse_mode: "HTML",
                    link_preview_options: { show_above_text: true },
                });
                try {
                    const key = await retrieveLastAccessedKey(ctx);
                    await ctx.editMessageText(wireguarConfigText + "ℹ️<b>QR кодийг үүсгэж байна...</b>", {
                        parse_mode: "HTML",
                        link_preview_options: { show_above_text: true },
                    });
                    const qrBuffer = await QRCode.toBuffer(key.secret, {
                        errorCorrectionLevel: "H",
                        type: "png",
                        width: 280,
                        margin: 2,
                        color: {
                            dark: "#000000",
                            light: "#FFFFFF",
                        },
                    });
                    const qrInputFile = new InputFile(Uint8Array.from(qrBuffer), "qrcode.png");

                    await ctx.editMessageText(wireguarConfigText + "<b>🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽</b>", {
                        parse_mode: "HTML",
                        link_preview_options: { show_above_text: true },
                    });

                    await deleteMoreRecentMessages(ctx);

                    await ctx.replyWithPhoto(qrInputFile, {
                        parse_mode: "HTML",
                        disable_notification: true,
                    });
                } catch (error) {
                    console.error(error);
                    await ctx.api.sendMessage(
                        config.adminTelegramId,
                        reportIssueText(
                            ctx.from.username ? `@${ctx.from.username} [${ctx.from.id}]` : `Anonymous [${ctx.from.id}]`,
                            `QR код амжилтгүй...`
                        ),
                        { parse_mode: "HTML" }
                    );
                    return await ctx.reply("🚫 QR код үүсгэхэд алдаа гарлаа. Та дахин оролдоно уу.", { parse_mode: "HTML" });
                }
            })
            .row();
        range
            .text("🟡 .conf файл", async (ctx) => {
                await ctx.editMessageText(wireguarConfigText + "<b>⏳ Түр хүлээнэ үү (файл)...</b>", {
                    parse_mode: "HTML",
                    link_preview_options: { show_above_text: true },
                });
                try {
                    const key = await retrieveLastAccessedKey(ctx);
                    const confBuffer = Buffer.from(key.secret, "utf-8");
                    const confFile = new InputFile(Uint8Array.from(confBuffer), `wg-cfg-${key.userId}.conf`);

                    await ctx.editMessageText(wireguarConfigText + "<b>🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽</b>", {
                        parse_mode: "HTML",
                        link_preview_options: { show_above_text: true },
                    });

                    await deleteMoreRecentMessages(ctx);

                    await ctx.replyWithDocument(confFile, {
                        parse_mode: "HTML",
                        disable_notification: true,
                    });
                } catch (error) {
                    console.error(error);
                    await ctx.api.sendMessage(
                        config.adminTelegramId,
                        reportIssueText(
                            ctx.from.username ? `@${ctx.from.username} [${ctx.from.id}]` : `Anonymous [${ctx.from.id}]`,
                            `.conf файл амжилтгүй...`
                        ),
                        { parse_mode: "HTML" }
                    );
                    return await ctx.reply("🚫 .conf файл үүсгэхэд алдаа гарлаа. Та дахин оролдоно уу.", { parse_mode: "HTML" });
                }
            })
            .row();
        range
            .text("🔴 Хуулах", async (ctx) => {
                await ctx.editMessageText(wireguarConfigText + "<b>⏳ Түр хүлээнэ үү (хуулах)...</b>", {
                    parse_mode: "HTML",
                    link_preview_options: { show_above_text: true },
                });
                try {
                    const key = await retrieveLastAccessedKey(ctx);

                    await deleteMoreRecentMessages(ctx);

                    return await ctx.editMessageText(wireguarConfigText + `\n<b>🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼</b>\n<code>${key.secret}</code>`, {
                        parse_mode: "HTML",
                        link_preview_options: { show_above_text: true },
                    });
                } catch (error) {
                    console.error(error);
                    await ctx.api.sendMessage(
                        config.adminTelegramId,
                        reportIssueText(
                            ctx.from.username ? `@${ctx.from.username} [${ctx.from.id}]` : `Anonymous [${ctx.from.id}]`,
                            `QR код амжилтгүй...`
                        ),
                        { parse_mode: "HTML" }
                    );
                    return await ctx.reply("🚫 Тохиргоо үүсгэхэд алдаа гарлаа. Та дахин оролдоно уу.", { parse_mode: "HTML" });
                }
            })
            .row();
        return range;
    })
    .back("WireGuard холбох цэс руу буцах ⬅️", async (ctx) => {
        try {
            await deleteMoreRecentMessages(ctx);
            await ctx.editMessageText(connectTextWireguard, { parse_mode: "HTML" });
        } catch (error) {
            console.error(error);
            await ctx.api.sendMessage(
                config.adminTelegramId,
                reportIssueText(
                    ctx.from.username ? `@${ctx.from.username} [${ctx.from.id}]` : `Anonymous [${ctx.from.id}]`,
                    `Буцаж болохгүй байна...`
                ),
                { parse_mode: "HTML" }
            );
            return await ctx.reply("🚫 Буцахад алдаа гарлаа. Та дахин оролдоно уу.", { parse_mode: "HTML" });
        }
    });

const connectWrapper = new Menu<MyContext>("connect-wrapper")
    .submenu(
        `${!config.hiddify ? "❌" : ""} HiddifyVPN 🇲🇳`,
        "connect-menu-hiddify",
        async (ctx) => await ctx.editMessageText(connectTextHiddify, { parse_mode: "HTML" })
    )
    .submenu(
        `${!config.wireguard ? "❌" : ""} WireguardVPN 🇳🇱`,
        "connect-menu-wireguard",
        async (ctx) => await ctx.editMessageText(connectTextWireguard, { parse_mode: "HTML" })
    )

    .row()
    .back("Үндсэн цэс рүү буцах ⬅️", goBackToMain);

const payment = new Menu<MyContext>("payment-menu")
    .text("💰 Би төлсөн", async (userCtx) => {
        await userCtx.api.sendMessage(
            config.adminTelegramId,
            iPaidMessage(
                userCtx.from.username
                    ? `@${userCtx.from.username} [<code>${userCtx.from.id}${tgDomain}</code>]`
                    : `Anonymous [<code>${userCtx.from.id}${tgDomain}</code>]`,
                `Хэрэглэгч төлбөр төллөө... (${new Date().toLocaleString()})`
            ),
            { parse_mode: "HTML" }
        );
        return await userCtx.reply(
            "🔄 Түр хүлээнэ үү... Админ шалгаад дараа нь автоматаар сунгагдана. Та шинэ түлхүүр үүсгэх хэрэгтэй болох болно хэрэв хугацаа дуусахаас өмнө төлж чадаагүй бол.",
            { parse_mode: "HTML", disable_notification: true }
        );
    })
    .row()
    .back("Үндсэн цэс рүү буцах ⬅️", goBackToMain);

const instructionsHiddify = new Menu<MyContext>("instructions-hiddify").back(
    "Hiddify холбох цэс руу буцах ⬅️",
    async (ctx) => await ctx.editMessageText(connectTextHiddify, { parse_mode: "HTML" })
);

const instructionsWireguard = new Menu<MyContext>("instructions-wireguard").back(
    "WireGuard холбох цэс руу буцах ⬅️",
    async (ctx) => await ctx.editMessageText(connectTextWireguard, { parse_mode: "HTML" })
);

connectHiddify.register(instructionsHiddify);

connectWireguard.register(instructionsWireguard);
connectWireguard.register(wireguardConfigMenu);

connectWrapper.register(connectHiddify);
connectWrapper.register(connectWireguard);

main.register(connectWrapper);
main.register(payment);

pmBot.use(main);

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
                reply_markup: main,
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
        await ctx.reply(mainText(newUser, true), { reply_markup: main, parse_mode: "HTML", disable_notification: true });
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

pmBot.errorBoundary(async (err) => {
    return await err.ctx.reply(`${err.error}`);
});

type DataType = {
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    phone?: string | null;
    about?: string | null;
    birthday?: string | null;
    hasPhoto?: boolean;
};

pmBot.filter(
    async (ctx) => {
        return `${ctx.from.id}` === config.adminTelegramId;
    },
    async (ctx) => {
        if (ctx.message?.text) {
            if (ctx.message.text.startsWith("/users")) {
                const users = await prisma.user.findMany({ select: { email: true }, orderBy: { createdAt: "asc" } });
                const list = "Хэрэглэгчид:\n" + usersList(users);
                await ctx.reply(list, { parse_mode: "HTML" });
            } else if (ctx.message.text.startsWith("/extend")) {
                const rawMessage = ctx.message.text;
                const [userEmail, days] = rawMessage.split(" ").slice(1);
                days ? await extendBySetDays(userEmail, Number(days)) : await extendByOneMonth(userEmail);
                await ctx.reply("ℹ️ Амжилттай");
            } else if (ctx.message.text.startsWith("/user")) {
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
                        await Promise.all([]);
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
                    await ctx.reply(`<code>${JSON.stringify(user, null, 2)}</code>`, { parse_mode: "HTML" });
                }
            } else {
                await ctx.reply(adminCommands, { parse_mode: "HTML" });
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
