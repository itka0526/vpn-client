import { Button } from "@/components/ui/button";
import { WireGuardIcon } from "@/components/ui/wireguard";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="w-full flex flex-col gap-4 items-center">
                <WireGuardIcon />
                <p className="text-center max-w-[512px]">
                    Хэрэв танд ямар нэгэн асуудал тулгарвал{" "}
                    <Link href={"/instructions"}>
                        <strong>зааврыг</strong>
                    </Link>{" "}
                    шалгана уу. Санал гомдолоо энэ{" "}
                    <Link href={"mailto:itka0526@gmail.com"}>
                        <strong>itka0526@gmail.com</strong>
                    </Link>{" "}
                    хаяг руу явуулна уу
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
