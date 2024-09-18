import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session-server";

export async function middleware(request: NextRequest) {
    const { userId } = await getSession();
    if (!userId) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: "/dashboard/:path*",
};
