"use client";

import { VPNType } from "@prisma/client";

type KeyCounterProps = {
    count: number;
    max: number;
    type: VPNType;
};

export default function KeyCounter({ count, max, type }: KeyCounterProps) {
    return (
        <div className="flex gap-4 items-center">
            <span>{type}</span>
            <span>
                {count} / {max}
            </span>
        </div>
    );
}
