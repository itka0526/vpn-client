"use server";

import { getSession } from "@/lib/session-server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { DashboardItemsWrapper } from "./items-wrapper";
import { Account } from "./account";
import AccountSkeleton from "./account-skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Хянах самбах | Гал VPN🔥 ",
    description: "Хянах самбах...",
};

export default async function Dashboard() {
    const user = await getSession();
    if (!user.userId) {
        redirect("/login");
    }
    return (
        <>
            <Suspense fallback={<AccountSkeleton />}>
                <Account userId={user.userId} />
            </Suspense>
            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <Spinner />
                    </div>
                }
            >
                <DashboardItemsWrapper userId={user.userId} />
            </Suspense>
        </>
    );
}
