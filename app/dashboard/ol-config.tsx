import { CardContent } from "@/components/ui/card";
import { useCopy } from "./copy";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

export function OlConfig({ config, createdAt }: { config: string; createdAt: Date }) {
    const { copied, copyToClipboard } = useCopy();
    const formattedDate = createdAt?.toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
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
            <span className="text-sm text-gray-400 flex-shrink-0 mx-2">{formattedDate}</span>
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
    return (
        <>
            <CardContent className="max-md:p-0">
                <Textarea
                    readOnly
                    value={config}
                    className="font-mono text-sm h-64 mb-4 bg-gray-800 text-white border-gray-700 focus:ring-gray-700 focus:border-gray-700"
                    placeholder="Nothing..."
                />
                <div className="flex gap-4">
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
