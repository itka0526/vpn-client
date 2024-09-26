"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, LucideQrCode, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import QRCode from "react-qr-code";

export function WgConfig({ config }: { config: string }) {
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(config).then(() => {
            setCopied(true);
            toast.success("Хууллаа!");
            setTimeout(() => setCopied(false), 2000);
        });
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
                    <div className="rounded-md shadow-md p-4 bg-black pointer-events-none">
                        <QRCode value={config} size={280} />
                    </div>
                </div>
            )}
            <CardContent>
                <Textarea
                    readOnly
                    value={config}
                    className="font-mono text-sm h-64 mb-4 bg-gray-800 text-white border-gray-700 focus:ring-gray-700 focus:border-gray-700"
                    placeholder="Nothing  ..."
                />
                <div className="flex gap-4">
                    <Button onClick={() => setOpen(true)}>
                        <LucideQrCode />
                    </Button>
                    <Button onClick={copyToClipboard} className="w-full">
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
