"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Welcome() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const visited = localStorage.getItem("visited");
        if (!visited) {
            setIsOpen(true);
            localStorage.setItem("visited", "true");
        }
    }, []);

    const closeGuide = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-900 text-gray-100 border-gray-800">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center text-gray-100">
                        Тавтай морил! 🔥
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeGuide}
                            className="h-6 w-6 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </CardTitle>
                    <CardDescription className="text-gray-400">Энийг заавал уншиарай.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                        <li>Шинэ хэрэглэгч 2 долоо хоногийн үнэгүй эрхтэй.</li>
                        <li>
                            Та <strong className="text-red-400">WireGuard</strong>, <strong className="text-orange-400">OpenVPN</strong>,{" "}
                            <strong className="text-green-400">Outline</strong> гэсэн програмудын аль хүссэнийн ашиглаж болно.
                        </li>
                        <li>Эдгээр програм нь бүх платформыг дэмждэг.</li>
                        <li>Android, iPhone, Windows, Macos, Linux</li>
                        <li>
                            <strong className="text-green-400">Outline</strong> тохируулхад хамгийн амархан нь.
                        </li>
                        <li>
                            <strong className="text-red-400">WireGuard</strong> QR код уншуулаад тохируулчихна.
                        </li>
                        <li>
                            <strong className="text-orange-400">OpenVPN</strong> iPhone дээр арай амархан.
                        </li>
                        <li>
                            Бүгдээрээ хурд сайтай. Тэгээд нэг тохируулчвал асуудалгүй хүссэнээрээ ашиглаж болно. Хэрэв хэцүү зүйл байвал заавар юм уу
                            эсвэл надтай холбогдоорой.
                        </li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button onClick={closeGuide} className="w-full font-semibold text-base bg-gray-800 text-gray-100 hover:bg-gray-700">
                        Ок, лойглоо!
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
