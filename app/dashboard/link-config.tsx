"use client";

import { useCopy } from "./copy";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { Key } from "@prisma/client";
import { KeyRouteRespType } from "../api/keys/route";
import toast from "react-hot-toast";

export function LinkConfig({ item: { createdAt, keyPath: config, id }, setUserKeys }: { item: Key; setUserKeys: Dispatch<SetStateAction<Key[]>> }) {
    const { copied, copyToClipboard } = useCopy();
    const formattedDate = createdAt.toLocaleDateString
        ? createdAt.toLocaleDateString("mn-MN", {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "Саяхан...";

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
        <div className="h-min flex items-center justify-between m-0 md:mx-6 px-6 py-2 border bg-gray-800 border-gray-700 focus:ring-gray-700 focus:border-gray-700 rounded-md">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={config}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center min-w-0 max-w-[1000px]"
                        >
                            <Button variant={"link"} className="p-2" size={"icon"}>
                                <ExternalLink className="h-4 w-4 text-primary-foreground " />
                            </Button>
                            <span className="mr-1 truncate">{config}</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-sm text-gray-400">{config}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <span className="text-sm text-gray-400 flex-shrink-0 mx-2 hidden md:block">{formattedDate}</span>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={() => deleteKey()} variant={"ghost"} disabled={deletingKey} className="max-md:mr-2">
                            {!deletingKey ? (
                                <>
                                    <Trash2 className="md:mr-2 h-4 w-4" /> <span className="hidden md:block">Устгах</span>
                                </>
                            ) : (
                                <>
                                    <Loader2 className="md:mr-2 h-4 w-4 animate-spin" /> <span className="hidden md:block">Устгах</span>
                                </>
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipTrigger asChild>
                        <Button onClick={() => copyToClipboard(config)} variant={"ghost"}>
                            {copied ? (
                                <>
                                    <Check className="md:mr-2 h-4 w-4" /> <span className="hidden md:block">Хууллаа</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="md:mr-2 h-4 w-4" /> <span className="hidden md:block">Хуулах</span>
                                </>
                            )}
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
