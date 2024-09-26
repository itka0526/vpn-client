import { config } from "@/lib/config";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session-server";
import { Key } from "@prisma/client";
import { NextResponse } from "next/server";

export type KeyRouteRespType = { message: string } & (
    | {
          status: false;
      }
    | {
          status: true;
          data: Key;
      }
);

export async function POST(): Promise<NextResponse<KeyRouteRespType>> {
    const session = await getSession();
    if (!session.userId) {
        return NextResponse.json({ message: "Та эхлээд нэвтэрнэ үү.", status: false });
    }
    // Check if limit exceeded
    const currLimit = await prisma.user.findUnique({ where: { id: session.userId }, select: { _count: { select: { keys: true } } } });
    if (!currLimit) {
        return NextResponse.json({ message: "Өгөгдлийн санд алдаа гарлаа.", status: false });
    }
    if (currLimit?._count.keys >= config.deviceLimitPerAcc) {
        return NextResponse.json({ message: "Лимит хэтэрсэн байна.", status: false });
    }
    const resp = await fetch("http://147.45.231.11/create_new_user", { method: "POST", body: JSON.stringify({ creds: process.env.CREDS + "\n" }) });
    const data = await resp.text();
    if (data.startsWith("Success!")) {
        const key = data.replace("Success! Output: ", "");
        try {
            const genKey = await prisma.key.create({ data: { secret: key, userId: session.userId } });
            return NextResponse.json({ message: "Амжилттай.", status: true, data: genKey });
        } catch (error) {
            return NextResponse.json({ message: "Database сервер ажилахгүй байна.", status: false });
        }
    } else {
        return NextResponse.json({ message: "VPN сервер ажилахгүй байна.", status: false });
    }
}
