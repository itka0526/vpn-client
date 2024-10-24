"use client";

import { Key } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { GenerateKey } from "./generate-key";
import { WgConfig } from "./wg-config";
import { config } from "@/lib/config";
import KeyCounter from "./key-counter";

export function DashboardItemsWireguard({ userKeys, setUserKeys }: { userKeys: Key[]; setUserKeys: Dispatch<SetStateAction<Key[]>> }) {
    const ff = (k: Key) => k.type === "WireGuardVPN";
    return (
        <>
            <section className="w-full border-b p-4 flex justify-between items-center">
                <KeyCounter count={userKeys.length} max={config.deviceLimitPerAcc} type="WireGuardVPN" />
                <GenerateKey setState={setUserKeys} limitExceeded={userKeys.length >= config.deviceLimitPerAcc} VPNType={"WireGuardVPN"} />
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 md:p-4 w-full h-full">
                {userKeys.filter(ff).map((item) => {
                    return <WgConfig key={`config-${item.id}`} config={item.secret} />;
                })}
            </section>
        </>
    );
}
