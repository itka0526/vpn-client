"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, LucideQrCode, Trash2, XIcon } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useCopy } from "./copy";
import { KeyRouteRespType } from "../api/keys/route";
import toast from "react-hot-toast";
import { ConfigItemProps } from "@/lib/types";

export function WgConfig({ item: { secret: config, id }, setUserKeys }: ConfigItemProps) {
    const [open, setOpen] = useState(false);
    const { copied, copyToClipboard } = useCopy();

    const [deletingKey, setDeletingKey] = useState(false);

    const deleteKey = async () => {
        setDeletingKey(!deletingKey);
        const resp = await fetch("/api/keys" + `?keyId=${id}`, { method: "DELETE" });
        const res: KeyRouteRespType = await resp.json();
        if (res.status) {
            toast.success(res.message);
            setUserKeys((prev) => {
                return prev.filter((other) => other.id !== id);
            });
        } else {
            toast.error(res.message);
        }
        setDeletingKey(false);
    };
    return (
        <>
            {open && (
                <div
                    className="fixed z-50 inset-0 w-screen h-screen bg-[rgba(255,255,255,0.2)] flex justify-center items-center"
                    onClick={() => setOpen(false)}
                >
                    <div className="absolute top-8 right-8">
                        <XIcon width={48} height={48} color="black" className="hover:rotate-90 transition-transform cursor-pointer" />
                    </div>
                    <div className="rounded-md shadow-md p-6 bg-white pointer-events-none">
                        <QRCode value={config} size={280} />
                    </div>
                </div>
            )}
            <CardContent className="max-md:p-0">
                <Textarea
                    readOnly
                    value={config}
                    className="font-mono text-sm h-64 mb-4 bg-gray-800 text-white border-gray-700 focus:ring-gray-700 focus:border-gray-700"
                    placeholder="Nothing..."
                />
                <div className="flex gap-4">
                    <Button onClick={() => deleteKey()} disabled={deletingKey}>
                        <Trash2 />
                    </Button>
                    <Button onClick={() => setOpen(true)}>
                        <LucideQrCode />
                    </Button>
                    <Button onClick={() => copyToClipboard(config)} className="w-full">
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4" /> Хууллаа
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" /> Хуулах
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </>
    );
}
