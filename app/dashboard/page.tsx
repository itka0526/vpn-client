"use server";

import { getSession } from "@/lib/session-server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { DashboardItemsWrapper } from "./items-wrapper";
import { Account } from "./account";
import AccountSkeleton from "./account-skeleton";
import prisma from "@/lib/db";
import { PartialUser } from "@/lib/types";

export default async function Dashboard() {
    const user = await getSession();
    let dbUser: PartialUser | null = null;
    if (!user.userId) {
        redirect("/login");
    }
    if (user.userId) {
        dbUser = await prisma.user.findUnique({ where: { id: user.userId }, select: { email: true, banned: true, activeTill: true } });
        // If the user does not exist destroy session
        if (!dbUser) {
            (await getSession()).destroy();
            redirect("/login");
        }
    }
    if (user.userId && dbUser) {
        return (
            <>
                <Suspense fallback={<AccountSkeleton />}>
                    <Account user={dbUser} />
                </Suspense>
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center w-full h-full">
                            <Spinner />
                        </div>
                    }
                >
                    <DashboardItemsWrapper userId={user.userId} />
                </Suspense>
            </>
        );
    }
}
