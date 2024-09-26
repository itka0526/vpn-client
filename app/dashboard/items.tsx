"use client";

import { Key } from "@prisma/client";
import { useState } from "react";
import { GenerateKey } from "./generate-key";
import { WgConfig } from "./wg-config";

export function DashboardItems({ userKeys }: { userKeys: Key[] }) {
    const [state, setState] = useState<Key[]>(userKeys);
    return (
        <>
            <section className="w-full border-b p-4 flex justify-end items-center">
                <GenerateKey setState={setState} />
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 w-full h-full">
                {state.map((item) => {
                    return <WgConfig key={`config-${item.id}`} config={item.secret} />;
                })}
            </section>
        </>
    );
}
