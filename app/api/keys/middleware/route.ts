import { config } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

function getRedirectLink({ userAgent = "", configLink = "" }) {
    if (config.hiddify) {
        if (/iPhone|iPad|iPod/i.test(userAgent)) {
            return `streisand://import/${configLink}/auto`;
        }
        if (/Android/i.test(userAgent)) {
            return `hiddify://import/${configLink}`;
        }
        return `hiddify://import/${configLink}`;
    }

    return `${configLink}`;
}

export async function GET(req: NextRequest) {
    const userAgent = req.headers.get("user-agent") || "";
    const configLink = new URL(req.url).searchParams.get("configLink");
    if (!configLink) {
        return NextResponse.json({ message: "Алдаатай өгөгдөл..." }, { status: 403 });
    }
    return NextResponse.redirect(getRedirectLink({ userAgent, configLink }));
}
