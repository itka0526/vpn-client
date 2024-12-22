export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

import { Bot, Context, InputFile, session, SessionFlavor, webhookCallback } from "grammy";
import prisma from "@/lib/db";
import { randomBytes } from "crypto";

import { Menu, MenuRange } from "@grammyjs/menu";
import { tgDomain } from "./menu";
import { Key, User } from "@prisma/client";
import { config } from "@/lib/config";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

type MinKey = {
    id: Key["id"];
    type: Key["type"] | "WORKAROUND";
};

interface SessionData {
    keys: Array<MinKey>;
    viewKeyId: MinKey["id"];
}

type MyContext = Context & SessionFlavor<SessionData>;

const main = new Menu<MyContext>("main-menu")
    .submenu("Холболт 🔌📱 ", "connect-menu", async (ctx) => await ctx.editMessageText("Холбох цэс"))
    .text("Заавар 🔗📱💻", async (ctx) => {
        await ctx.editMessageText(
            `
<b>OpenVPN тохиргооны заавар:</b>

1. <b>App Store</b>, <b>Play Store</b>, эсвэл Интернэтээс <b>OpenVPN</b> аппыг татаж суулгаарай.

2. Телеграм ботаар дамжуулан холболт хийж, <b>Түлхүүр үүсгэх</b> гэснийг сонгоно уу.

3. Түлхүүр файлыг татаж авна уу.

4. <b>"OpenVPN Connect"</b> аппийг нээгээд:
   - <b>"Add"</b> товчийг дарна уу.
   - <b>"File"</b> товчийг сонгоно уу.
   - <b>"Browse"</b> товчийг дарна уу.

5. Татсан <b>"татсан_түлхүүр.ovpn"</b> файлыг сонгож, оруулна уу.

<em>Эсвэл, татсан түлхүүр файлаа "Open with OpenVPN Connect" гэж сонгож оруулж болно.</em>
`,
            { parse_mode: "HTML" }
        );
    });

const bot = new Bot<MyContext>(token);
const pmBot = bot.chatType("private");

pmBot.use(session({ initial: () => ({ keys: [...Array(0)] }), prefix: "user-" }));

const connect = new Menu<MyContext>("connect-menu", {})
    .dynamic(async (ctx) => {
        if (!ctx.from) return;
        // TODO: Check if Vercel remove session data...
        const keys = ctx.session.keys || [];
        const range = new MenuRange<MyContext>();
        for (let i = 0; i < keys.length; i++) {
            const vpnType = keys[i].type === "OpenVPN" ? "OpenVPN" : keys[i].type === "WireGuardVPN" ? "WireGuard" : "Outline";
            const displayName = `Түлхүүр (${vpnType}) ${i + 1}`;
            range
                .text(displayName, async (ctx) => {
                    if (!ctx.from) return;
                    const key = await prisma.key.findFirst({
                        where: {
                            id: ctx.session.viewKeyId,
                            user: { email: `${ctx.from.id}${tgDomain}` },
                        },
                    });
                    if (!key) {
                        return await ctx.reply("Дахин эхлүүлэнэ үү...", { reply_markup: main });
                    }
                    const uintBuf = new Uint8Array(Buffer.from(key.secret, "utf-8"));
                    const file = new InputFile(uintBuf, `${ctx.from.id}_${i + 1}.ovpn`);
                    ctx.deleteMessage();
                    await ctx.replyWithDocument(file, { caption: key.createdAt.toLocaleString() });
                    await ctx.reply("Холбох цэс", { reply_markup: connect });
                })
                .row();
        }
        return range;
    })
    .text("Түлхүүрнүүд 🔄", async (ctx) => {
        try {
            await ctx.editMessageText("Түр хүлээнэ үү...");
            ctx.session.keys = await prisma.key.findMany({
                where: { user: { email: `${ctx.from.id}${tgDomain}` } },
                select: { type: true, id: true },
            });
            ctx.menu.update();
            return await ctx.editMessageText(`Шинэчлэгдсэн огноо: ${new Date().toLocaleString()}`);
        } catch (err) {
            console.error(err);
            return await ctx.editMessageText(`Алдаа гарлаа`);
        }
    })
    .text("Түлхүүр үүсгэх 🔑", async (ctx) => {
        await ctx.editMessageText("Түр хүлээнэ үү...");
        const dbRes = await prisma.user.findUnique({
            where: { email: `${ctx.from.id}${tgDomain}` },
            select: { banned: true, activeTill: true, _count: { select: { keys: true } } },
        });
        if (!dbRes) {
            return await ctx.editMessageText("Өгөгдлийн санд алдаа гарлаа.");
        }
        const { _count, banned, activeTill } = dbRes;
        if (activeTill < new Date()) {
            // TODO: GO TO PAYMENT
            return await ctx.editMessageText("Та төлбөрөө төлнө үү.");
        }
        if (banned) {
            return await ctx.editMessageText("Таны хаяг блоклогдсон байна.");
        }
        if (_count.keys >= config.deviceLimitPerAcc) {
            return await ctx.editMessageText(`Түлхүүрний хязгаар хэтэрсэн байна. (${_count.keys}/${config.deviceLimitPerAcc})`);
        }
        const resp: Response = await fetch(`http://${process.env.OVIP}/create_new_user`, {
            method: "POST",
            body: JSON.stringify({ creds: process.env.OVPW }),
        });
        const data = await resp.text();
        if (data.startsWith("Success!")) {
            const key = data.replace("Success! Output: ", "");
            const [keyPath, keyConfig] = key.split("@#$");
            try {
                const {
                    user: { keys },
                } = await prisma.key.create({
                    data: { secret: keyConfig, user: { connect: { email: `${ctx.from.id}${tgDomain}` } }, keyPath: keyPath, type: "OpenVPN" },
                    select: { user: { select: { keys: { select: { id: true, type: true } } } } },
                });
                // Update the keys in session
                ctx.session.keys = [...keys];
                ctx.menu.update();
                return await ctx.editMessageText("Амжилттай.");
            } catch (error) {
                return await ctx.editMessageText("Database сервер ажилахгүй байна.");
            }
        } else {
            return await ctx.editMessageText("VPN сервер ажилахгүй байна.");
        }
    })
    .row()
    .back("Үндсэн цэс рүү буцах", async (ctx) => {
        await ctx.editMessageText("Үндсэн цэс");
    });

main.register(connect);
pmBot.use(main);

pmBot.command("start", async (ctx) => {
    const loadingMessage = await ctx.reply("Уншиж байна... 🔄");
    const generatedEmail = `${ctx.from.id}${tgDomain}`;
    const init = async (u: User, nu: boolean) => {
        const cnt = `
<b>Сайн уу, ${u.email}</b>!
${nu ? "Шинэ хэрэглэгч болгон 14 хоногийн үнэгүй эрхтэй. Хэрэв асуудал гарвал админ руу бичээрэй." : ""}
<b>Төлөв</b>: ${u.banned ? "Блоклогдсон 🚫" : new Date() > u.activeTill ? "Хүчингүй 💵" : `Хүчинтэй (${u.activeTill.toISOString().slice(0, 19)}) ✅`}
                `;
        return await ctx.reply(cnt, { reply_markup: main, parse_mode: "HTML" });
    };
    try {
        // If the user is already registered
        const user = await prisma.user.findUnique({
            where: { email: generatedEmail },
        });
        // Just don't do anything?
        if (user) {
            ctx.session.keys = (await prisma.key.findMany({ where: { userId: user.id }, select: { type: true, id: true } })) || [];
            await ctx.deleteMessages([loadingMessage.message_id]);
            return await init(user, false);
        }
        // Else we create the user
        const password = `${randomBytes(5).toString("hex")}`;
        const newUser = await prisma.user.create({ data: { email: generatedEmail, password: password } });
        await ctx.deleteMessages([loadingMessage.message_id]);
        // Respond back to the user
        return await init(newUser, true);
    } catch (error) {
        console.error(error);
        await ctx.deleteMessages([loadingMessage.message_id]);
        return await ctx.reply("Бүртгэл амжилтгүй.\n/start");
    }
});

pmBot.errorBoundary(async (err) => {
    return await err.ctx.reply(`${err.error}`);
});

export const POST = webhookCallback(bot, "std/http", {
    onTimeout: "return",
    timeoutMilliseconds: 100,
});
