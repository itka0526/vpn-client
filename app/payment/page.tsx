import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TelegramIcon } from "@/components/ui/telegram";
import { config } from "@/lib/config";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session-server";
import { PartialUser } from "@/lib/types";
import { ArrowLeft, Github } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountDetails } from "./account-details";

export default async function Page() {
    const user = await getSession();
    let dbUser: PartialUser | null = null;
    if (!user.userId) {
        redirect("/login");
    }
    if (user.userId) {
        dbUser = await prisma.user.findUnique({ where: { id: user.userId }, select: { email: true, banned: true, activeTill: true } });
        // If the user does not exist destroy session
        if (!dbUser) {
            (await getSession()).destroy();
            redirect("/login");
        }
    }
    return (
        <section>
            <Card className="w-full max-w-xl bg-gray-800 border-gray-700">
                <Button variant="link" asChild className="px-0 text-sm text-white ml-4 mt-2">
                    <Link href="/login" className="flex items-center">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Буцах
                    </Link>
                </Button>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">Төлбөр төлөх</CardTitle>
                    <p className="text-blue-400">Сунгах заавар</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 items-center space-x-3">
                        <p className="text-blue-400 text-pretty">
                            Би энэ үйлчилгээг анх үнэ төлбөргүй үнэ төлбөргүй хэвээр нь үлдье гэж төлөвлөж байсан. Гэвч, илүү хүчирхэг сервер
                            ажиллуулах нь миний бодож байснаас илүү зардалтай байгаад байна. Хэрэв танд энэ үйлчилгээ таалагдаж байгаа бөгөөд та
                            үүнийг үргэлжлүүлэн ашиглахыг хүсч байгаа бол сард <span className="text-red-400">{config.paymentAmountPerMonth}</span>{" "}
                            рубль төлнө үү. Гүйлгээний утга хэсэгт <span className="text-red-400">{dbUser?.email}</span>-г оруулна уу. Хэрэв энэ
                            үйлчилгээ нь амжилттай болвол би QPay төлбөрийн системийг нэвтрүүлэх болно. Дараах данс руу мөнгө өө хийнэ үү:
                            <br />
                            <span className="text-red-400">
                                ({config.bankType}) <AccountDetails content={config.accountDetails} />
                            </span>
                            <br />
                            <em>Хэрэв танд нэмэлт асуулт байвал холбоо барина уу.</em>
                        </p>
                        <Link href={`${config.telegram}`} target="_blank" className="text-blue-300 hover:text-blue-200 transition-colors flex">
                            <TelegramIcon />
                            {config.telegram}
                        </Link>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
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
