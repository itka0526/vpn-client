import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, Phone } from "lucide-react";

import ProfileImage from "@/public/profile.jpg";
import Image from "next/image";
import { config } from "@/lib/config";
import { TelegramIcon } from "@/components/ui/telegram";
import Link from "next/link";
import { BackBtn } from "@/components/ui/back-btn";

export default function Page() {
    return (
        <>
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <BackBtn />
                <CardHeader className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 overflow-hidden bg-gray-700 rounded-full">
                        <Image
                            alt="Profile picture"
                            className="object-cover w-full h-full"
                            height="128"
                            src={ProfileImage}
                            style={{
                                aspectRatio: "128/128",
                                objectFit: "cover",
                            }}
                            width="128"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Ганхөлөг Итгэлт</CardTitle>
                    <p className="text-blue-400">4-р курсын оюутан</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <TelegramIcon />
                        <Link href={`${config.telegram}`} target="_blank" className="hover:text-blue-200 text-blue-300 transition-colors">
                            {config.telegram}
                        </Link>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Phone className="text-gray-400" />
                        <a href={`tel:${config.phone}`} className="hover:text-blue-200 text-blue-300 transition-colors">
                            {config.phone}
                        </a>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Mail className="text-gray-400" />
                        <a href={`mailto:${config.mail}`} className="hover:text-blue-200 text-blue-300 transition-colors">
                            {config.mail}
                        </a>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                        <p className="text-sm text-gray-300">
                            Над шиг сурж буй оюутнуудад интернетийг асуудалгүй ашиглахын тулд би энэ вэбсайтыг хийв.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
                    <Button variant="ghost" size="icon" className="hover:text-blue-300 hover:bg-gray-700 text-blue-400">
                        <Link href={config.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-5 h-5" />
                        </Link>
                        <span className="sr-only">Github</span>
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
