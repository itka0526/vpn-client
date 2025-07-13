"use server";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import { DesktopMenu } from "./desktop-menu";
import { PartialUser } from "@/lib/types";
import Link from "next/link";

export async function Account({ user }: { user: PartialUser }) {
    const { activeTill, banned, email } = user;
    const inactive = new Date() > activeTill;
    return (
        <Card className="w-full bg-gray-800 border-gray-700">
            <CardContent className="px-4 py-4">
                <nav className="md:gap-0 flex flex-row items-center justify-between gap-4">
                    <div className="md:items-center flex gap-6">
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
                            {inactive ? (
                                <Link href="/payment" className={cn("font-medium text-red-400")}>
                                    Төлөх
                                </Link>
                            ) : banned ? (
                                <span className={cn("font-medium text-red-500")}>{"Блоклогдсон"}</span>
                            ) : (
                                <span className={cn("font-medium text-gray-100")}>{"Идэвхитэй"}</span>
                            )}
                        </div>
                    </div>
                    <MobileMenu activeTill={activeTill} inactive={inactive} />
                    <DesktopMenu activeTill={activeTill} inactive={inactive} />
                </nav>
            </CardContent>
        </Card>
    );
}
