"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { logout } from "./logout";

export function MobileMenu({ activeTill, inactive }: { activeTill: Date; inactive: boolean }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <div className="relative">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="default" size="icon" className="md:hidden">
                        <MenuIcon className="w-5 h-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                    <SheetHeader>
                        <SheetTitle>Цэс</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col justify-between mt-4 space-y-4">
                        <div className="block text-sm text-gray-400">
                            <span className="block">Хүчинтэй хугацаа:</span>
                            <span className="font-medium text-gray-200">{activeTill.toLocaleString("ru-RU")}</span>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Link href="/payment" className={cn(inactive ? "text-red-500" : "")}>
                                    Төлбөр төлөх
                                </Link>
                            </Button>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={logout}>
                                <LogOutIcon className="md:mr-2 w-4 h-4" />
                                <span className="block">Гарах</span>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
