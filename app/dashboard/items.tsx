"use client";

import { Key } from "@prisma/client";
import { useState } from "react";
import { GenerateKey } from "./generate-key";
import { WgConfig } from "./wg-config";
import { config } from "@/lib/config";

export function DashboardItems({ userKeys }: { userKeys: Key[] }) {
    const [state, setState] = useState<Key[]>(userKeys);
    return (
        <>
            <section className="w-full border-b p-4 flex justify-between items-center">
                <div>
                    <span>
                        {state.length} / {config.deviceLimitPerAcc}
                    </span>
                </div>
                <GenerateKey setState={setState} limitExceeded={state.length >= config.deviceLimitPerAcc} />
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:p-4 w-full h-full">
                {state.map((item) => {
                    return <WgConfig key={`config-${item.id}`} config={item.secret} />;
                })}
            </section>
        </>
    );
}
