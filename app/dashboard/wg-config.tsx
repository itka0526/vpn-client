"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Download, LucideQrCode, Trash2, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import QRCode from "react-qr-code";
import { useCopy } from "./copy";
import { KeyRouteRespType } from "../api/keys/route";
import toast from "react-hot-toast";
import { ConfigItemProps } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isTMA } from "@telegram-apps/sdk-react";
import axios from "axios";

export function WgConfig({ item: { secret: config, id, keyPath }, setUserKeys }: ConfigItemProps) {
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

    const fileName = keyPath.split("/").at(-1) ?? "RANDOM_KEY";

    const rawDownloadKey = useCallback(() => {
        const element = document.createElement("a");
        const file = new Blob([config], { type: "text/plain" });

        element.setAttribute("href", URL.createObjectURL(file));
        element.setAttribute("download", fileName);

        element.click();
        URL.revokeObjectURL(element.href);
    }, [config, fileName]);

    const downloadKey = isTMA()
        ? async () => {
              const resp = await fetch(
                  "/api/keys?" +
                      new URLSearchParams({
                          telegram: "true",
                          keyId: `${id}`,
                      }).toString(),
                  { method: "GET" }
              );

              const jsonResp: KeyRouteRespType = await resp.json();

              if (jsonResp.status) toast.success(jsonResp.message);
              else toast.error(jsonResp.message);
          }
        : rawDownloadKey;

    return (
        <>
            {open && (
                <div
                    className="fixed z-50 inset-0 w-screen h-screen bg-[rgba(255,255,255,0.2)] flex justify-center items-center"
                    onClick={() => setOpen(false)}
                >
                    <div className="top-8 right-8 absolute">
                        <XIcon width={48} height={48} color="black" className="hover:rotate-90 transition-transform cursor-pointer" />
                    </div>
                    <div className="p-6 bg-white rounded-md shadow-md pointer-events-none">
                        <QRCode value={config} size={280} />
                    </div>
                </div>
            )}
            <CardContent className="max-md:p-0">
                <Textarea
                    readOnly
                    value={config}
                    className="focus:ring-gray-700 focus:border-gray-700 h-64 mb-4 font-mono text-sm text-white bg-gray-800 border-gray-700"
                    placeholder="Nothing..."
                />
                <div className="flex gap-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={() => deleteKey()} disabled={deletingKey}>
                                    <Trash2 />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm text-gray-400">{deletingKey ? "Устгаж байна..." : "Түлхүүр устгах"}</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={() => copyToClipboard(config)}>{copied ? <Check /> : <Copy />}</Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm text-gray-400">{copied ? "Хууллаа" : "Хуулах"} </p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={downloadKey}>
                                    <Download />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm text-gray-400">Татах</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={() => setOpen(true)} className="w-full">
                                    <LucideQrCode className="mr-2" />
                                    <span className=" font-medium text-gray-100">QR код</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm text-gray-400">QR код уншуулах</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </>
    );
}
