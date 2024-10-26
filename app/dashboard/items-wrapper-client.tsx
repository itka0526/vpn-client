"use client";

import { Key } from "@prisma/client";
import { useState } from "react";
import { DashboardItemsOpenVPN } from "./ov-items";
import { DashboardItemsWireguard } from "./wg-items";
import { DashboardItemsOutline } from "./ol-items";

export default function DashboardItemsWrapperClient({ userKeys }: { userKeys: Key[] }) {
    const [keys, setKeys] = useState(userKeys);
    return (
        <>
            <DashboardItemsOutline userKeys={keys} setUserKeys={setKeys} />
            <DashboardItemsOpenVPN userKeys={keys} setUserKeys={setKeys} />
            <DashboardItemsWireguard userKeys={keys} setUserKeys={setKeys} />
        </>
    );
}
