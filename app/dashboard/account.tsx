"use server";

import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session-server";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { MobileMenu } from "./mobile-menu";
import { DesktopMenu } from "./desktop-menu";

export async function Account({ userId }: { userId: number }) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, banned: true, activeTill: true } });
    if (!user) {
        (await getSession()).destroy();
        redirect("/login");
    }
    const { activeTill, banned, email } = user;
    const inactive = new Date() > activeTill;
    return (
        <Card className="w-full bg-gray-800 border-gray-700">
            <CardContent className="px-4 py-4">
                <nav className="flex gap-4 justify-between items-center flex-row md:gap-0">
                    <div className="flex md:items-center gap-6">
                        <div className="text-sm text-gray-400">
                            <span className="block">Хэрэглэгч:</span>
                            <span
                                className={cn(
                                    "font-semibold text-gray-100",
                                    banned ? "text-red-500" : inactive ? "text-yellow-500" : "text-green-500"
                                )}
                            >
                                {email}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">
                            <span className="block">Төлөв:</span>
                            <span className={cn("font-medium text-gray-100")}>{banned ? "Блоклогдсон" : inactive ? "Идэвхгүй" : "Идэвхитэй"}</span>
                        </div>
                    </div>
                    <MobileMenu activeTill={activeTill} inactive={inactive} />
                    <DesktopMenu activeTill={activeTill} inactive={inactive} />
                </nav>
            </CardContent>
        </Card>
    );
}
