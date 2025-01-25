import { RegisterForm } from "@/components/forms/register-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TelegramIcon } from "@/components/ui/telegram";
import { config } from "@/lib/config";
import { ArrowLeft, Github, Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Бүртгүүлэх",
    description: "Бүртгүүлэх хуудас.",
};

export default function Register() {
    if (config.disableRegister) {
        return (
            <section className="grid place-items-center w-full h-full">
                <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                    <Button variant="link" asChild className="px-0 text-sm text-white ml-4 mt-2">
                        <Link href="/login" className="flex items-center">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Буцах
                        </Link>
                    </Button>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-white">⚠️ Бүртгүүлэх ⚠️</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-white text-center">
                            Одоогоор вэб сайтаар бүртгэх боломжгүй байна. Хэрэв та бүртгүүлэхийг хүсвэл Telegram ботыг ашиглан бүртгүүлнэ үү.
                        </p>
                        <div className="flex items-center justify-center space-x-3">
                            <Link href={`${config.telegramBot}`} target="_blank" className="text-blue-300 hover:text-blue-200 transition-colors">
                                {config.telegramBot}
                            </Link>
                        </div>
                        <p className="text-white text-center">Админтай холбогдох:</p>
                    </CardContent>
                    <CardFooter className="flex justify-center space-x-4">
                        <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">
                            <Link href={config.telegram} target="_blank" rel="noopener noreferrer">
                                <Mail />
                            </Link>
                            <span className="sr-only">Email</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">
                            <Link href={config.telegram} target="_blank" rel="noopener noreferrer">
                                <TelegramIcon fill="rgb(96 165 250 / var(--tw-text-opacity))" />
                            </Link>
                            <span className="sr-only">Telegram</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">
                            <Link href={config.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-5 w-5" />
                            </Link>
                            <span className="sr-only">Github</span>
                        </Button>
                    </CardFooter>
                </Card>
            </section>
        );
    }
    return <RegisterForm />;
}
