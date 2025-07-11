import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TelegramIcon } from "@/components/ui/telegram";
import { config } from "@/lib/config";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session-server";
import { PartialUser } from "@/lib/types";
import { Github } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountDetails } from "./account-details";
import { BackBtn } from "@/components/ui/back-btn";
import { CheckPaymentButton } from "./check-payment-button";

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
                <BackBtn />
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">Төлбөр төлөх</CardTitle>
                    <p className="text-blue-400">Сунгах заавар</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4 space-x-3">
                        <p className="text-pretty text-sm text-center text-blue-400">
                            Сард <span className="text-red-400">{config.paymentAmountPerMonth}</span> рубль төлнө үү. Гүйлгээний утга хэсэгт{" "}
                            <span className="text-red-400">{dbUser?.email}</span>-г оруулна уу. Дараах данс руу мөнгө өө хийнэ үү:
                            <br />
                            <br />
                            <span className="text-red-400">
                                ({config.bankType}) <AccountDetails content={config.accountDetails} />
                            </span>
                            <br />
                            <br />
                            <CheckPaymentButton />
                            <br />
                            <br />
                            <em>Төлбөрийг баталгаажуулсаны дараа сунгагдах болно. Хэрэв танд нэмэлт асуулт байвал холбоо барина уу.</em>
                        </p>
                        <Link href={`${config.telegram}`} target="_blank" className="hover:text-blue-200 flex text-blue-300 transition-colors">
                            <TelegramIcon />
                            {config.telegram}
                        </Link>
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
        </section>
    );
}
