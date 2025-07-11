import { NextResponse } from "next/server";
import { bot } from "../../bot/bot";
import { config } from "@/lib/config";
import { getSession } from "@/lib/session-server";
import prisma from "@/lib/db";
import { notifyAdminText } from "./text";
import { adminResponse } from "./admin-response";

export async function POST() {
    try {
        const session = await getSession();
        if (!session.userId) {
            return NextResponse.json({ message: "Та эхлээд нэвтэрнэ үү.", status: false });
        }

        // Check if the user is banned
        const dbRes = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { email: true, banned: true, activeTill: true },
        });
        if (!dbRes) {
            return NextResponse.json({ message: "Өгөгдлийн санд алдаа гарлаа.", status: false });
        }
        const { banned, activeTill, email } = dbRes;

        if (banned) {
            return NextResponse.json({ message: "Таны хаяг блоклогдсон байна. Та админтай холбогдоно уу...", status: false });
        }

        await bot.api.sendMessage(config.adminTelegramId, notifyAdminText(email, activeTill), {
            parse_mode: "HTML",
            reply_markup: adminResponse(email),
        });

        return NextResponse.json({ message: "ℹ️ Админ хариу өгөхийг хүлээнэ үү..." });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "⚙️ Сервер дээр том алдаа гарлаа..." }, { status: 500 });
    }
}
