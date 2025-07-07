"use client";

import { config } from "@/lib/config";
import { Key } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import KeyCounter from "./key-counter";
import { GenerateKey } from "./generate-key";
import { LinkConfig } from "./link-config";

export function DashboardItemsHiddify({ userKeys, setUserKeys }: { userKeys: Key[]; setUserKeys: Dispatch<SetStateAction<Key[]>> }) {
    const ff = (k: Key) => k.type === "HiddifyVPN";
    const keyCount = userKeys.filter(ff).length;
    return (
        <>
            <section className="flex items-center justify-between w-full p-4 border-b">
                <KeyCounter count={keyCount} max={config.deviceLimitPerAcc} type="HiddifyVPN" />
                <GenerateKey setState={setUserKeys} limitExceeded={keyCount >= config.deviceLimitPerAcc} VPNType={"HiddifyVPN"} />
            </section>
            <section className="md:gap-4 md:p-4 grid w-full h-full grid-cols-1 gap-8">
                {userKeys.filter(ff).map((item) => {
                    return <LinkConfig key={`config-${item.id}`} item={item} setUserKeys={setUserKeys} />;
                })}
            </section>
        </>
    );
}
