"use client";

import { config } from "@/lib/config";
import { Key } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import KeyCounter from "./key-counter";
import { GenerateKey } from "./generate-key";
import { OvConfig } from "./ov-config";

export function DashboardItemsOpenVPN({ userKeys, setUserKeys }: { userKeys: Key[]; setUserKeys: Dispatch<SetStateAction<Key[]>> }) {
    const ff = (k: Key) => k.type === "OpenVPN";
    const keyCount = userKeys.filter(ff).length;

    return (
        <>
            <section className="flex items-center justify-between w-full p-4 border-b">
                <KeyCounter count={keyCount} max={config.deviceLimitPerAcc} type="OpenVPN" />
                <GenerateKey setState={setUserKeys} limitExceeded={keyCount >= config.deviceLimitPerAcc} VPNType={"OpenVPN"} />
            </section>
            <section className="md:gap-4 md:p-4 grid w-full h-full grid-cols-1 gap-8 place-content-start">
                {userKeys.filter(ff).map((item) => {
                    return <OvConfig key={`config-${item.id}`} setUserKeys={setUserKeys} item={item} fileName={item.keyPath.replace("/root/", "")} />;
                })}
            </section>
        </>
    );
}
