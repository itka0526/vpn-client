"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { convertToHumanFileSize } from "@/lib/convertToHumanFS";
import clsx from "clsx";
import { Download, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { KeyRouteRespType } from "../api/keys/route";
import { ConfigItemProps } from "@/lib/types";
import toast from "react-hot-toast";

export function OvConfig({ item: { id, secret, createdAt }, fileName, setUserKeys }: ConfigItemProps & { fileName: string }) {
    const [deletingConfig, setDeletingConfig] = useState(false);

    const deleteConfig = async () => {
        setDeletingConfig(!deletingConfig);
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
        setDeletingConfig(false);
    };

    const downloadConfig = useCallback(() => {
        const element = document.createElement("a");
        const file = new Blob([secret], { type: "application/x-openvpn-profile" });

        element.setAttribute("href", URL.createObjectURL(file));
        element.setAttribute("download", fileName);

        element.click();
        URL.revokeObjectURL(element.href);
    }, [secret, fileName]);

    const formattedDate = createdAt.toLocaleDateString
        ? createdAt.toLocaleDateString("mn-MN", {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "Саяхан...";

    return (
        <div
            className={clsx(
                "h-min flex items-center justify-between m-0 md:mx-6 px-6 py-2 border bg-gray-800 border-gray-700 focus:ring-gray-700 focus:border-gray-700 rounded-md"
            )}
        >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="mr-1 truncate flex items-center min-w-0 max-w-[1000px] cursor-pointer font-medium text-gray-100">
                            {fileName}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-sm text-gray-400">{`${formattedDate} '${fileName}'-ийг үүсгэв`}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <span className="md:block flex-shrink-0 hidden mx-2 text-sm text-gray-400">{convertToHumanFileSize(new Blob([secret]).size)}</span>
            <span className="md:block flex-shrink-0 hidden mx-2 text-sm text-gray-400">{formattedDate}</span>

            <div className="flex justify-end">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="mr-2" onClick={deleteConfig} variant={"ghost"} disabled={deletingConfig}>
                                <Trash2 className="md:mr-2 w-4 h-4" /> <span className="md:block hidden">Устгах</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm text-gray-400">Түлхүүр устгах</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="mr-2" onClick={downloadConfig} variant={"ghost"}>
                                <Download className="md:mr-2 w-4 h-4" /> <span className="md:block hidden">Татах</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm text-gray-400">Файл татах</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
