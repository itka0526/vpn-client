"use client";

import { Key } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { GenerateKey } from "./generate-key";
import { WgConfig } from "./wg-config";
import { config } from "@/lib/config";
import KeyCounter from "./key-counter";

export function DashboardItemsWireguard({ userKeys, setUserKeys }: { userKeys: Key[]; setUserKeys: Dispatch<SetStateAction<Key[]>> }) {
    const ff = (k: Key) => k.type === "WireGuardVPN";
    const keyCount = userKeys.filter(ff).length;

    return (
        <>
            <section className="flex items-center justify-between w-full p-4 border-b">
                <KeyCounter count={keyCount} max={config.deviceLimitPerAcc} type="WireGuardVPN" />
                <GenerateKey setState={setUserKeys} limitExceeded={keyCount >= config.deviceLimitPerAcc} VPNType={"WireGuardVPN"} />
            </section>
            <section className="md:grid-cols-3 md:gap-4 md:p-4 grid w-full h-full grid-cols-1 gap-8">
                {userKeys.filter(ff).map((item) => {
                    return <WgConfig key={`config-${item.id}`} item={item} setUserKeys={setUserKeys} />;
                })}
            </section>
        </>
    );
}
