import prisma from "@/lib/db";
import { Key } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const res = await prisma.user.findMany({
        where: {
            activeTill: {
                lte: new Date(),
            },
        },
        select: {
            keys: true,
        },
    });

    const wgKeys: Key[] = [],
        ovKeys: Key[] = [];

    for (const user of res) {
        for (const key of user.keys) {
            if (key.type === "OpenVPN") ovKeys.push(key);
            if (key.type === "WireGuardVPN") wgKeys.push(key);
        }
    }

    const etwg = process.env.WGIP,
        wgpw = process.env.WGPW,
        etov = process.env.OVIP,
        ovpw = process.env.OVPW;

    const deleteKeysFromDB = async (keys: Key[]) =>
        await prisma.key.deleteMany({
            where: {
                keyPath: {
                    in: keys.map((x) => x.keyPath),
                },
            },
        });

    if (!etwg || !wgpw || !etov || !ovpw) {
        return NextResponse.json({ ok: false, message: "Environment bad." });
    }

    let response = "";

    if (wgKeys.length >= 1) {
        const resp = await fetch(`http://${etwg}/delete_user`, {
            method: "POST",
            body: JSON.stringify({
                creds: process.env.WGPW + "\n",
                keys: wgKeys.map((k) => k.keyPath),
            }),
        });
        if (resp.status !== 200) {
            return NextResponse.json({ ok: false, message: await resp.text() });
        }
        response += await resp.text();
    }

    if (ovKeys.length >= 1) {
        const resp = await fetch(`http://${etov}/delete_user`, {
            method: "POST",
            body: JSON.stringify({
                creds: process.env.OVPW,
                clientNames: ovKeys.map((k) => k.keyPath),
            }),
        });
        if (resp.status !== 200) {
            // Can remove wireguard keys from database
            if (wgKeys.length >= 1) {
                try {
                    await deleteKeysFromDB(wgKeys);
                } catch (error) {
                    return NextResponse.json({ ok: true, message: response + " Could not remove wireguard keys." });
                }
            }
            return NextResponse.json({ ok: false, message: await resp.text() });
        }
        response += await resp.text();
    }

    // Delete all keys from database
    try {
        await deleteKeysFromDB(wgKeys.concat(ovKeys));
    } catch (error) {
        return NextResponse.json({ ok: true, message: response });
    }

    return NextResponse.json({ ok: true, message: response });
}
