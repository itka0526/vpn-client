"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { logout } from "./logout";

export function DesktopMenu({ activeTill, inactive }: { activeTill: Date; inactive: boolean }) {
    return (
        <div className="md:flex md:space-x-6 items-center hidden">
            <div className="md:block hidden text-sm text-gray-400">
                <span className="block">Хүчинтэй хугацаа:</span>
                <span className="font-medium text-gray-200">{activeTill.toLocaleString("ru-RU")}</span>
            </div>
            <div className="flex items-center gap-2">
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/payment" className={cn(inactive ? "text-red-500" : "")}>
                        Төлбөр төлөх
                    </Link>
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={logout}>
                    <LogOutIcon className="md:mr-2 w-4 h-4" />
                    <span className="md:block hidden">Гарах</span>
                </Button>
            </div>
        </div>
    );
}
