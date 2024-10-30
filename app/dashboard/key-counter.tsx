"use client";

import { Button } from "@/components/ui/button";
import { VPNType } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type KeyCounterProps = {
    count: number;
    max: number;
    type: VPNType;
};

export default function KeyCounter({ count, max, type }: KeyCounterProps) {
    return (
        <div className="flex gap-4 items-center">
            <Link
                href={"/instructions"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center min-w-0 max-w-[1000px]"
            >
                <Button variant={"link"} size={"icon"}>
                    <ExternalLink className="h-4 w-4 text-primary-foreground " />
                </Button>
                <span className="mr-1 truncate">{type}</span>
            </Link>
            <span>
                {count} / {max}
            </span>
        </div>
    );
}
