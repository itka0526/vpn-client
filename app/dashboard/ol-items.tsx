"use client";

import { config } from "@/lib/config";
import { Key } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import KeyCounter from "./key-counter";
import { GenerateKey } from "./generate-key";
import { OlConfig } from "./ol-config";

export function DashboardItemsOutline({ userKeys, setUserKeys }: { userKeys: Key[]; setUserKeys: Dispatch<SetStateAction<Key[]>> }) {
    const ff = (k: Key) => k.type === "OutlineVPN";
    return (
        <>
            <section className="w-full border-b p-4 flex justify-between items-center">
                <KeyCounter count={userKeys.length} max={config.deviceLimitPerAcc} type="OutlineVPN" />
                <GenerateKey setState={setUserKeys} limitExceeded={userKeys.length >= config.deviceLimitPerAcc} VPNType={"OutlineVPN"} />
            </section>
            <section className="grid grid-cols-1 gap-8 md:gap-4 md:p-4 w-full h-full">
                {userKeys.filter(ff).map((item) => {
                    return <OlConfig key={`config-${item.id}`} config={item.secret} createdAt={item.createdAt} />;
                })}
            </section>
        </>
    );
}
