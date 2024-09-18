"use server";

import { getSession } from "@/lib/session-server";

export default async function Dashboard() {
    const user = await getSession();
    return (
        <h1>
            Welcome to Dashboard! {"{"}
            {user.userId}
            {"}"}
        </h1>
    );
}
