import { createSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { validate, parse } from "@telegram-apps/init-data-node";
import { tgDomain } from "../../bot/menu";
import prisma from "@/lib/db";
import { generateRandomString } from "../../bot/helper";

export async function POST(req: NextRequest) {
    if (!req.headers.has("Authorization")) {
        return NextResponse.json({ message: "Нэвтрэх эрх алдаатай байна!" }, { status: 401 });
    }
    const BOT_TOKEN = process.env.NODE_ENV === "development" ? process.env.TELEGRAM_BOT_TOKEN_DEV : process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) return NextResponse.json({ message: "Серверийн алдаа!" }, { status: 500 });

    // <auth-type> must be "tma", and <auth-data> is Telegram Mini Apps init data.
    const [authType, authData = ""] = (req.headers.get("Authorization") || "").split(" ");
    switch (authType) {
        case "tma":
            try {
                // Validate init data.
                validate(authData, BOT_TOKEN, {
                    // We consider init data sign valid for 1 hour from their creation moment.
                    expiresIn: 3600,
                });

                // Parse init data.
                const parsedData = parse(authData);

                // Retrieving Telegram ID
                const telegramId = parsedData.user?.id;
                if (!telegramId) {
                    return NextResponse.json({ message: "TelegramID байхгүй!" }, { status: 400 });
                }

                // Setup
                const email = telegramId + tgDomain;

                // Search DB
                let user = await prisma.user.findUnique({ where: { email } });

                // If not found generate new user
                if (!user) {
                    const password = generateRandomString();
                    user = await prisma.user.create({
                        data: { email: email, password: password, userName: parsedData?.user?.username ?? "Anonymous" },
                    });
                }

                // Success
                await createSession(user);
                return NextResponse.json({ message: "Түр хүлээнэ үү." }, { status: 200 });
            } catch (e) {
                return NextResponse.json({ message: "Муу өгөгдөл!" }, { status: 400 });
            }
        default:
            return NextResponse.json({ message: "Алдаатай зам!" }, { status: 404 });
    }
}
