import { config } from "@/lib/config";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session-server";
import { AllVPNTypes } from "@/lib/types";
import { Key, VPNType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type KeyRouteRespType = { message: string } & (
    | {
          status: false;
      }
    | {
          status: true;
          data: Key;
      }
);

export async function POST(req: NextRequest): Promise<NextResponse<KeyRouteRespType>> {
    const session = await getSession();
    if (!session.userId) {
        return NextResponse.json({ message: "Та эхлээд нэвтэрнэ үү.", status: false });
    }
    // Check if limit exceeded and if the user is banned
    const dbRes = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { banned: true, activeTill: true, _count: { select: { keys: true } } },
    });
    if (!dbRes) {
        return NextResponse.json({ message: "Өгөгдлийн санд алдаа гарлаа.", status: false });
    }
    const { _count, banned, activeTill } = dbRes;
    if (activeTill < new Date()) {
        return NextResponse.json({ message: "Та төлбөрөө төлнө үү.", status: false });
    }
    if (banned) {
        return NextResponse.json({ message: "Таны хаяг блоклогдсон байна.", status: false });
    }
    if (_count.keys >= config.deviceLimitPerAcc) {
        return NextResponse.json({ message: "Лимит хэтэрсэн байна.", status: false });
    }
    const { searchParams } = new URL(req.url);
    const validatedVPNType = AllVPNTypes.safeParse(searchParams.get("VPNType"));

    if (!validatedVPNType.success) {
        return NextResponse.json({ message: "Буруу 'Request Query' явуулсан байна.", status: false });
    }
    const vt: VPNType = validatedVPNType.data;
    let resp: Response;

    if (vt === "OpenVPN") {
        resp = await fetch(`http://${process.env.OVIP}/create_new_user`, {
            method: "POST",
            body: JSON.stringify({ creds: process.env.OVPW }),
        });
    } else {
        resp = await fetch(`http://${process.env.WGIP}/create_new_user`, {
            method: "POST",
            body: JSON.stringify({ creds: process.env.WGPW }),
        });
    }

    const data = await resp.text();
    console.log(data);
    if (data.startsWith("Success!")) {
        const key = data.replace("Success! Output: ", "");
        const [keyPath, keyConfig] = key.split("@#$");
        try {
            const genKey = await prisma.key.create({ data: { secret: keyConfig, userId: session.userId, keyPath: keyPath, type: vt } });
            return NextResponse.json({ message: "Амжилттай.", status: true, data: genKey });
        } catch (error) {
            return NextResponse.json({ message: "Database сервер ажилахгүй байна.", status: false });
        }
    } else {
        return NextResponse.json({ message: "VPN сервер ажилахгүй байна.", status: false });
    }
}
