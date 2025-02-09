import prisma from "@/lib/db";
import { User } from "@prisma/client";
import { MyContext } from "./types";
import { MenuFlavor } from "@grammyjs/menu";
import { config } from "@/lib/config";
import { connectTextHiddify, connectTextWireguard, tgDomain } from "./menu";
import { randomBytes } from "crypto";

export const extendByOneMonth = async (email: User["email"]) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("Өгөгдлийн сан хариу өгөхгүй байна.");

        const now = new Date();
        let activeTill = user.activeTill;

        if (now > activeTill) activeTill = now;

        activeTill.setMonth(activeTill.getMonth() + 1);
        await prisma.user.update({ data: { activeTill }, where: { id: user.id } });
    } catch (error) {
        return error;
    }
};

export const extendBySetDays = async (email: User["email"], days: number) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("Өгөгдлийн сан хариу өгөхгүй байна.");

        const now = new Date();
        let activeTill = user.activeTill;

        if (now > activeTill) activeTill = now;

        activeTill.setDate(activeTill.getDate() + days);
        await prisma.user.update({ data: { activeTill }, where: { id: user.id } });
    } catch (error) {
        return error;
    }
};

export const checkUser = async (ctx: MyContext & MenuFlavor, prefixText: string) => {
    if (!ctx.from) {
        return await ctx.editMessageText(prefixText + "\n<b>🚫 Алдаа гарлаа.</b>", { parse_mode: "HTML" });
    }
    await ctx.editMessageText(prefixText + "\n<b>⏳ Та түр хүлээнэ үү...</b>", { parse_mode: "HTML" });
    const dbRes = await prisma.user.findUnique({
        where: { email: `${ctx.from.id}${tgDomain}` },
        select: { banned: true, activeTill: true, _count: { select: { keys: true } } },
    });
    if (!dbRes) {
        return await ctx.editMessageText(prefixText + "\n<b>🚫 Өгөгдлийн санд алдаа гарлаа.</b>", { parse_mode: "HTML" });
    }
    const { _count, banned, activeTill } = dbRes;
    if (activeTill < new Date()) {
        return await ctx.editMessageText(prefixText + "\n<b>⚠️ Та төлбөрөө төлнө үү.</b>", { parse_mode: "HTML" });
    }
    if (banned) {
        return await ctx.editMessageText(prefixText + "\n<b>⚠️ Таны хаяг блоклогдсон байна.</b>", { parse_mode: "HTML" });
    }
    if (_count.keys >= config.deviceLimitPerAcc) {
        return await ctx.editMessageText(prefixText + `\n<b>⚠️ Түлхүүрний хязгаар хэтэрсэн байна: (${_count.keys}/${config.deviceLimitPerAcc})</b>`, {
            parse_mode: "HTML",
        });
    }
};

export const generateRandomString = (size = 5) => {
    return `${randomBytes(size).toString("hex")}`;
};

export const getAllKeys = async (ctx: MyContext & MenuFlavor, prefixText: typeof connectTextWireguard | typeof connectTextHiddify) => {
    if (!ctx.from) {
        return await ctx.editMessageText(prefixText + "\n<b>🚫 Алдаа гарлаа.</b>", { parse_mode: "HTML" });
    }
    try {
        await ctx.editMessageText(prefixText + "\n⏳ <b>Таны түлхүүрнүүдийг хайж байна...</b>", { parse_mode: "HTML" });
        ctx.session.keys = await prisma.key.findMany({
            where: { user: { email: `${ctx.from.id}${tgDomain}` } },
            select: { type: true, id: true, keyPath: true },
        });
        ctx.menu.update();
        return await ctx.editMessageText(prefixText + `\n<b>📅 Шинэчлэгдсэн огноо: ${new Date().toLocaleTimeString()}</b>`, {
            parse_mode: "HTML",
        });
    } catch (err) {
        return await ctx.editMessageText(prefixText + `\n<b>👨‍💻 Алдаа гарлаа... Хөгжүүлэгчтэй холбоо барина уу</b>`, {
            parse_mode: "HTML",
        });
    }
};

export const retrieveLastAccessedKey = async (ctx: MyContext & MenuFlavor) => {
    const res = await prisma.lastAccessedKey.findUnique({
        where: { userEmail: `${ctx?.from?.id}${tgDomain}` },
        select: { key: true },
    });
    if (!res) {
        // Navigate back
        ctx.menu.back();
        throw new Error("Түлхүүр олдсонгүй...");
    }
    return res.key;
};

export const deleteMoreRecentMessages = async (ctx: MyContext & MenuFlavor) => {
    const start = ctx.msg?.message_id;
    if (!start) return;
    const { message_id: end } = await ctx.reply("🔶🔷🔶🔷🔶🔷🔶🔷🔶🔷🔶🔷🔶🔷🔶");
    await ctx.deleteMessages(Array.from({ length: end - start }, (_, i) => start + i + 1));
};
