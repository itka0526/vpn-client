"use client";

import { Key } from "@prisma/client";
import { useState } from "react";
import { DashboardItemsOpenVPN } from "./ov-items";
import { DashboardItemsWireguard } from "./wg-items";
import { DashboardItemsOutline } from "./ol-items";
import { config } from "@/lib/config";
import { DashboardItemsHiddify } from "./hi-items";

export default function DashboardItemsWrapperClient({ userKeys }: { userKeys: Key[] }) {
    const [keys, setKeys] = useState(userKeys);
    return (
        <>
            {config.hiddify ? <DashboardItemsHiddify userKeys={keys} setUserKeys={setKeys} /> : null}
            {config.outline ? <DashboardItemsOutline userKeys={keys} setUserKeys={setKeys} /> : null}
            {config.openvpn ? <DashboardItemsOpenVPN userKeys={keys} setUserKeys={setKeys} /> : null}
            {config.wireguard ? <DashboardItemsWireguard userKeys={keys} setUserKeys={setKeys} /> : null}
        </>
    );
}
