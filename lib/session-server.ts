import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "./types";
import { getIronSession } from "iron-session";
import prisma from "./db";

export async function getSession() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    // If the user in db does not exist remove the cookie
    if (session.userId && !(await prisma.user.findUnique({ where: { id: session.userId } }))) {
        session.destroy();
    }
    return session;
}
