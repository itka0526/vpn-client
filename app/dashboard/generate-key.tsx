"use client";

import { Button } from "@/components/ui/button";
import { Key } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { KeyRouteRespType } from "../api/keys/route";
import toast from "react-hot-toast";
import { PlusIcon } from "lucide-react";

export function GenerateKey({ setState }: { setState: Dispatch<SetStateAction<Key[]>> }) {
    const [loading, setLoading] = useState(false);
    const fetchKey = async () => {
        setLoading(true);
        const resp = await fetch("/api/keys", { method: "POST" });
        const res: KeyRouteRespType = await resp.json();
        if (res.status) {
            setState((prevState) => [...prevState, res.data]);
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    return (
        <Button onClick={fetchKey} disabled={loading}>
            <PlusIcon />
        </Button>
    );
}