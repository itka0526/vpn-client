"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { convertToHumanFileSize } from "@/lib/convertToHumanFS";
import { Download, FileCog } from "lucide-react";
import { useCallback } from "react";

export function OvConfig({ config, fileName, createdAt }: { config: string; fileName: string; createdAt: Date }) {
    const handleClick = useCallback(() => {
        const element = document.createElement("a");
        const file = new Blob([config], { type: "application/x-openvpn-profile" });

        element.setAttribute("href", URL.createObjectURL(file));
        element.setAttribute("download", fileName);

        element.click();
        URL.revokeObjectURL(element.href);
    }, [config, fileName]);

    return (
        <Card className="m-0 md:mt-0 md:m-6 flex flex-col bg-gray-800 text-white border-gray-700 focus:ring-gray-700 focus:border-gray-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileCog className="min-h-5 min-w-5" />
                    <span>{fileName}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-400">Хэмжээ: {convertToHumanFileSize(new Blob([config]).size)}</p>
                <p className="text-sm text-gray-400">Огноо: {createdAt.toLocaleString()}</p>
            </CardContent>
            <CardFooter className="mt-auto">
                <Button className="w-full" onClick={handleClick}>
                    <Download className="mr-2 h-4 w-4" /> Татах
                </Button>
            </CardFooter>
        </Card>
    );
}
