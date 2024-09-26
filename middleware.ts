import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session-server";

export async function middleware(request: NextRequest) {
    const { userId } = await getSession();
    if (userId && !request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login/:path*", "/register/:path*", "/"],
};
