"use server";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session-server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function Account({ userId }: { userId: number }) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, banned: true, activeTill: true } });
    if (!user) {
        (await getSession()).destroy();
        redirect("/login");
    }
    const { activeTill, banned, email } = user;
    return (
        <Card className="w-full bg-gray-800 border-gray-700">
            <CardContent className="px-6 py-4">
                <nav className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="text-sm text-gray-400">
                            <span className="block">Хэрэглэгч:</span>
                            <span
                                className={cn(
                                    "font-semibold text-gray-100",
                                    banned ? "text-red-500" : new Date() > activeTill ? "text-yellow-500" : "text-green-500"
                                )}
                            >
                                {email}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">
                            <span className="block">Төлөв:</span>
                            <span className={cn("font-medium text-gray-100")}>
                                {banned ? "Блоклогдсон" : new Date() > activeTill ? "Идэвхгүй" : "Идэвхитэй"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="text-sm text-gray-400">
                            <span className="block">Хүчинтэй хугацаа:</span>
                            <span className="font-medium text-gray-200">{activeTill.toLocaleString()}</span>
                        </div>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Link href="/payment">Төлбөр төлөх</Link>
                        </Button>
                    </div>
                </nav>
            </CardContent>
        </Card>
    );
}
