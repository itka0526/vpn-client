"use client";

import { config } from "@/lib/config";
import { Key } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import KeyCounter from "./key-counter";
import { GenerateKey } from "./generate-key";
import { OvConfig } from "./ov-config";

export function DashboardItemsOpenVPN({ userKeys, setUserKeys }: { userKeys: Key[]; setUserKeys: Dispatch<SetStateAction<Key[]>> }) {
    const ff = (k: Key) => k.type === "OpenVPN";
    return (
        <>
            <section className="w-full border-b p-4 flex justify-between items-center">
                <KeyCounter count={userKeys.length} max={config.deviceLimitPerAcc} type="OpenVPN" />
                <GenerateKey setState={setUserKeys} limitExceeded={userKeys.length >= config.deviceLimitPerAcc} VPNType={"OpenVPN"} />
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 md:p-4 w-full h-full">
                {userKeys.filter(ff).map((item) => {
                    return (
                        <OvConfig
                            key={`config-${item.id}`}
                            config={item.secret}
                            fileName={item.keyPath.replace("/root/", "")}
                            createdAt={item.createdAt}
                        />
                    );
                })}
            </section>
        </>
    );
}
