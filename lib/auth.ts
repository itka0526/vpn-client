"use server";

import { User } from "@prisma/client";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./types";
import { cookies } from "next/headers";

export async function createSession(user: User) {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    // Write the neccessary session data
    // If there was a prior session data it overwrites
    session.userId = user.id;
    await session.save();

    return session;
}
