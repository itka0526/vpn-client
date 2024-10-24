"use server";

import prisma from "@/lib/db";
import DashboardItemsWrapperClient from "./items-wrapper-client";

export async function DashboardItemsWrapper({ userId }: { userId: number }) {
    const userKeys = await prisma.key.findMany({ where: { userId: userId } });
    return <DashboardItemsWrapperClient userKeys={userKeys} />;
}
