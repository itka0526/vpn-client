import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="w-full flex flex-col gap-4 items-center">
                <h1 className="text-xl">Сайн уу!</h1>
                <p className="text-center max-w-[512px]">
                    Та эндээс өндөр хурдны VPN авах боломжтой. Нэг төхөөрөмжид зориулж түлхүүр үүсгэхийн тулд{" "}
                    <Link href={"/instructions"}>
                        <strong>зааврыг</strong>
                    </Link>{" "}
                    дагана уу. Хэрэв танд заавартай холбоотой асуудал гарвал{" "}
                    <Link href={"mailto:itka0526@gmail.com"}>
                        <strong>itka0526@gmail.com</strong>
                    </Link>{" "}
                    хаягаар холбогдоно уу.
                </p>
            </section>
            <section className="flex flex-col gap-4 justify-center w-full">
                <Link href={"/register"} className="w-full flex justify-center">
                    <Button variant="outline" className="w-full">
                        Бүртгүүлэх
                    </Button>
                </Link>
                <Link href={"/login"} className="w-full flex justify-center">
                    <Button variant="default" className="w-full">
                        Нэвтрэх
                    </Button>
                </Link>
            </section>
        </>
    );
}
