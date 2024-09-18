import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "./types";
import { getIronSession } from "iron-session";

export async function getSession() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    return session;
}
