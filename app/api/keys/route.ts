import { config } from "@/lib/config";
import { getSession } from "@/lib/session-server";
import { AllVPNTypes, HiddifyKey, OutlineVPNRespType } from "@/lib/types";
import { Key, VPNType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Agent } from "https";
import prisma from "@/lib/db";
import axios from "axios";
import { createHiddifyKey, HIDDIFY_API_USER_BASE_URL } from "../bot/hiddify";
import { tgDomain } from "../bot/menu";

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
        select: { email: true, banned: true, activeTill: true, _count: { select: { keys: true } } },
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

    switch (vt) {
        case "OpenVPN":
            resp = await fetch(`http://${process.env.OVIP}/create_new_user`, {
                method: "POST",
                body: JSON.stringify({ creds: process.env.OVPW }),
            });
            break;
        case "WireGuardVPN":
            resp = await fetch(`http://${process.env.WGIP}/create_new_user`, {
                method: "POST",
                body: JSON.stringify({ creds: process.env.WGPW }),
            });
            break;
        case "OutlineVPN":
            const axiosResp = await axios.post(`${process.env.OUTLINE_API}/access-keys`, null, {
                httpsAgent: new Agent({
                    rejectUnauthorized: false,
                }),
            });
            if (axiosResp.statusText !== "Created") {
                return NextResponse.json({ message: "Серверийг буруу тохируулсан байна.", status: false });
            }
            resp = new Response(JSON.stringify(axiosResp.data), { headers: { "Content-Type": "application/json" } });
            break;
        case "HiddifyVPN":
            let tgId = 0;
            if (dbRes.email.endsWith(tgDomain) && /^-?\d+$/.test(dbRes.email.split("@")[0])) tgId = parseInt(dbRes.email.split("@")[0]);
            const hiddifyKey = await createHiddifyKey(tgId, `key_${tgId ?? dbRes.email.split("@")[0]}_${_count.keys}`);
            resp = new Response(JSON.stringify(hiddifyKey), { headers: { "Content-Type": "application/json" } });
            break;
        default:
            return NextResponse.json({ message: "Серверийг буруу тохируулсан байна.", status: false });
    }

    if (vt === "HiddifyVPN") {
        try {
            const data = await resp.json();
            const res = HiddifyKey.safeParse(data);
            if (!res.success) {
                console.log(res.error);
                return NextResponse.json({ message: "Hiddify сервер буруу өгөгдөл буцаалаа.", status: false });
            }
            const { data: key } = res;
            const genKey = await prisma.key.create({
                data: {
                    userId: session.userId,
                    type: "HiddifyVPN",
                    keyPath: HIDDIFY_API_USER_BASE_URL.toString() + `/${key.uuid}`,
                    secret: JSON.stringify(key),
                },
            });
            return NextResponse.json({ message: "Амжилттай.", status: true, data: genKey });
        } catch (error) {
            return NextResponse.json({ message: "Database сервер ажилахгүй байна.", status: false });
        }
    } else if (vt === "OutlineVPN") {
        // Handle outline vpn
        const data = await resp.json();
        const res = OutlineVPNRespType.safeParse(data);

        if (!res.success) {
            return NextResponse.json({ message: "Outline сервер буруу өгөгдөл буцаалаа.", status: false });
        }
        const { accessUrl, id } = res.data;
        try {
            const genKey = await prisma.key.create({ data: { secret: accessUrl, userId: session.userId, keyPath: id, type: vt } });
            return NextResponse.json({ message: "Амжилттай.", status: true, data: genKey });
        } catch (error) {
            return NextResponse.json({ message: "Database сервер ажилахгүй байна.", status: false });
        }
    } else if (vt === "OpenVPN" || vt === "WireGuardVPN") {
        // Handle wireguard and ovpn
        const data = await resp.text();
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
    } else {
        return NextResponse.json({ message: "Сервер дээр буруу тохируулго байна.", status: false });
    }
}
