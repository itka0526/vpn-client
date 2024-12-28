"use client";

import { useCopy } from "./copy";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

export function LinkConfig({ config, createdAt }: { config: string; createdAt: Date }) {
    const { copied, copyToClipboard } = useCopy();
    const formattedDate = createdAt.toLocaleDateString
        ? createdAt.toLocaleDateString("mn-MN", {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "Саяхан...";
    return (
        <div className="flex items-center justify-between m-0 md:mx-6 px-6 py-2 border bg-gray-800 border-gray-700 focus:ring-gray-700 focus:border-gray-700 rounded-md">
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
