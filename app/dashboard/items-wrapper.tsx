"use server";

import prisma from "@/lib/db";
import { DashboardItems } from "./items";

export async function DashboardItemsWrapper({ userId }: { userId: number }) {
    const userKeys = await prisma.key.findMany({ where: { userId: userId } });
    return <DashboardItems userKeys={userKeys} />;
}
