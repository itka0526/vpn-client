import { config } from "@/lib/config";
import { getSession } from "@/lib/session-server";
import { AllVPNTypes, HiddifyKey, OutlineVPNRespType } from "@/lib/types";
import { Key, User, VPNType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Agent } from "https";
import prisma from "@/lib/db";
import axios from "axios";
import { createHiddifyKey, HIDDIFY_API_USER_BASE_URL, HiddifyKeyResponseType, removeHiddifyKeyDetails } from "../bot/hiddify";
import { tgDomain } from "../bot/menu";
import { bot } from "../bot/bot";
import { InputFile } from "grammy";

export type KeyRouteRespType = { message: string } & (
    | {
          status: false;
      }
    | {
          status: true;
          data: Key;
      }
);

const createNewKeyWgOrOv = {
    checkServerEnv: () => {
        let etwg = process.env.WGIP,
            wgpw = process.env.WGPW,
            etov = process.env.OVIP,
            ovpw = process.env.OVPW;

        if (config.wireguard && (!etwg || !wgpw)) {
            throw new Error("Wireguard environment variables missing.");
        }
        etwg = etwg as string;
        wgpw = wgpw as string;

        if (config.openvpn && (!etov || !ovpw)) {
            throw new Error("OpenVPN environment variables missing.");
        }
        etov = etov as string;
        ovpw = ovpw as string;

        return { wgAddr: etwg, ovAddr: etov, wgCreds: wgpw, ovCreds: ovpw };
    },
    toRawServer: async (address: string, credentials: string) =>
        await fetch(`http://${address}/create_new_user`, {
            method: "POST",
            body: JSON.stringify({ creds: credentials }),
        }),
    writeToDb: async (
        data: string,
        userIdentifier: User["email"] | number,
        keyType: typeof VPNType.WireGuardVPN | typeof VPNType.OpenVPN
    ): Promise<KeyRouteRespType> => {
        if (data.startsWith("Success!")) {
            const key = data.replace("Success! Output: ", "");
            const [keyPath, keyConfig] = key.split("@#$");
            try {
                const genKey = await prisma.key.create({
                    data:
                        typeof userIdentifier === "string"
                            ? {
                                  secret: keyConfig,
                                  user: { connect: { email: userIdentifier } },
                                  keyPath: keyPath,
                                  type: keyType as VPNType,
                              }
                            : { secret: keyConfig, userId: userIdentifier, keyPath: keyPath, type: keyType },
                });
                return { message: "Амжилттай.", status: true, data: genKey };
            } catch (error) {
                return { message: "Database сервер ажилахгүй байна.", status: false };
            }
        } else {
            return { message: "VPN сервер ажилахгүй байна.", status: false };
        }
    },
};

export async function POST(req: NextRequest): Promise<NextResponse<KeyRouteRespType>> {
    const session = await getSession();
    if (!session.userId) {
        return NextResponse.json({ message: "Та эхлээд нэвтэрнэ үү.", status: false });
    }

    const { searchParams } = new URL(req.url);
    const validatedVPNType = AllVPNTypes.safeParse(searchParams.get("VPNType"));

    if (!validatedVPNType.success) {
        return NextResponse.json({ message: "Буруу 'Request Query' явуулсан байна.", status: false });
    }

    // Check if limit exceeded and if the user is banned
    const dbRes = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { email: true, banned: true, activeTill: true, _count: { select: { keys: { where: { type: validatedVPNType.data } } } } },
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

    try {
        const { ovAddr, ovCreds, wgAddr, wgCreds } = createNewKeyWgOrOv.checkServerEnv();

        const vt: VPNType = validatedVPNType.data;
        let resp: Response;

        switch (vt) {
            case config.openvpn && "OpenVPN":
                resp = await createNewKeyWgOrOv.toRawServer(ovAddr, ovCreds);
                break;
            case config.wireguard && "WireGuardVPN":
                resp = await createNewKeyWgOrOv.toRawServer(wgAddr, wgCreds);
                break;
            case config.outline && "OutlineVPN":
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
            case config.hiddify && "HiddifyVPN":
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
            return NextResponse.json(await createNewKeyWgOrOv.writeToDb(data, session.userId, vt));
        } else {
            return NextResponse.json({ message: "Сервер дээр буруу тохируулго байна.", status: false });
        }
    } catch (error) {
        console.error(error);
        switch (error) {
            case Error:
                return NextResponse.json({ status: false, message: `${error}` });
            default:
                return NextResponse.json({ status: false, message: `Алдаа гарлаа.` });
        }
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse<KeyRouteRespType>> {
    const session = await getSession();
    if (!session.userId) {
        return NextResponse.json({ message: "Та эхлээд нэвтэрнэ үү.", status: false });
    }
    // Check if the user is banned
    const dbRes = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { email: true, banned: true, activeTill: true, keys: true },
    });
    if (!dbRes) {
        return NextResponse.json({ message: "Өгөгдлийн санд алдаа гарлаа.", status: false });
    }
    const { banned, activeTill } = dbRes;
    if (activeTill < new Date()) {
        return NextResponse.json({ message: "Та төлбөрөө төлнө үү.", status: false });
    }
    if (banned) {
        return NextResponse.json({ message: "Таны хаяг блоклогдсон байна.", status: false });
    }

    const { searchParams } = new URL(req.url);

    const rawKeyId = searchParams.get("keyId");

    if (!rawKeyId) return NextResponse.json({ message: "Буруу 'Request Query' явуулсан байна. KeyId дутуу байна.", status: false });

    const key = dbRes.keys.find(({ id }) => id === Number(rawKeyId));

    if (!key) return NextResponse.json({ message: "Буруу 'Request Query' явуулсан байна. Хэрэглэгчид тийм түлхүүр алга.", status: false });

    const etwg = process.env.WGIP,
        wgpw = process.env.WGPW,
        etov = process.env.OVIP,
        ovpw = process.env.OVPW;

    if (config.wireguard && (!etwg || !wgpw)) {
        return NextResponse.json({ status: false, message: "Wireguard environment variables missing." });
    }

    if (config.openvpn && (!etov || !ovpw)) {
        return NextResponse.json({ status: false, message: "OpenVPN environment variables missing." });
    }

    const vt: VPNType = key.type;

    if (config.openvpn && vt === "OpenVPN") {
        const resp = await fetch(`http://${etov}/delete_user`, {
            method: "POST",
            body: JSON.stringify({
                creds: process.env.OVPW,
                clientNames: [key.keyPath],
            }),
        });
        if (resp.status !== 200) {
            return NextResponse.json({ status: false, message: await resp.text() });
        }
    }
    if (config.wireguard && vt === "WireGuardVPN") {
        const resp = await fetch(`http://${etwg}/delete_user`, {
            method: "POST",
            body: JSON.stringify({
                creds: process.env.WGPW,
                clientNames: [key.keyPath],
            }),
        });
        if (resp.status !== 200) {
            return NextResponse.json({ status: false, message: await resp.text() });
        }
    }
    if (config.outline && vt === "OutlineVPN") {
        return NextResponse.json({ status: false, message: "TODO: Remove OutlineVPN key..." });
    }
    if (config.hiddify && vt === "HiddifyVPN") {
        const keyData = JSON.parse(key.secret) as HiddifyKeyResponseType;
        try {
            await removeHiddifyKeyDetails(keyData.uuid);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ status: false, message: "Hiddify алдаа гарлаа." });
        }
    }
    try {
        await prisma.key.delete({ where: { id: key.id } });
    } catch (error) {
        return NextResponse.json({ status: false, message: `Түлхүүрийг сангаас устгаж чадсангүй.` });
    }
    return NextResponse.json({ message: `"${vt}"` + " түлхүүр амжилттай устлаа.", status: true, data: key });
}

export async function GET(req: NextRequest): Promise<NextResponse<{ status: boolean; message: string }>> {
    const { searchParams } = new URL(req.url);
    const mustSendToTelegram = searchParams.get("telegram");

    if (mustSendToTelegram && config.wireguard) {
        const rawKeyId = searchParams.get("keyId");

        if (!rawKeyId) {
            return NextResponse.json({ message: "Буруу өгөгдөл...", status: false });
        }

        try {
            const dbRes = await prisma.key.findUnique({
                where: { id: Number(rawKeyId) },
                select: { user: { select: { email: true } }, secret: true, keyPath: true },
            });

            if (!dbRes) {
                throw new Error("Түлхүүр олдсонгүй...");
            }

            const {
                user: { email },
                keyPath,
                secret,
            } = dbRes;

            if (!email.endsWith(tgDomain)) {
                throw new Error("Хэрэглэгч telegram-д бүртгэлгүй байна");
            }

            const telegramUserId = email.split("@")[0];
            const fileName = keyPath.split("/").at(-1);
            const config = Buffer.from(secret, "utf8");

            try {
                await bot.api.sendDocument(telegramUserId, new InputFile(Uint8Array.from(config), fileName));
            } catch (_) {
                throw new Error("Telegram хаяг руу явуулах боломжгүй байна");
            }

            return NextResponse.json({ message: "Telegram-аа шалгаарай", status: true });
        } catch (error) {
            return NextResponse.json({ message: `${error}`, status: false });
        }
    } else {
        return NextResponse.json({ message: "Хөгжүүлээгүй...", status: false });
    }
}
