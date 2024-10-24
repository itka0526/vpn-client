import { Button } from "@/components/ui/button";
import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="w-full flex flex-col gap-4 items-center">
                <div className="overflow-hidden rounded-md bg-white p-3">
                    <Image src={Logo} alt="Лого" width={100} height={100} />
                </div>
                <p className="text-center max-w-[512px] my-4">
                    <Link href={"/instructions"}>
                        <h1 className="text-2xl text-red-500">
                            <strong>Заавар үзэх</strong>
                        </h1>
                    </Link>
                </p>
            </section>
            <section className="flex flex-col gap-4 justify-center md:max-w-[33%] w-full">
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
