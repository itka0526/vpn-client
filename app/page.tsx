import AuthSection from "@/components/home-page/auth-section";
import Logo from "@/public/logo.png";

import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    return (
        <>
            <section className="flex flex-col items-center w-full gap-4">
                <div className="p-3 overflow-hidden bg-white rounded-md">
                    <Image src={Logo} alt="Лого" width={100} height={100} />
                </div>
                <p className="text-center max-w-[512px] my-4">
                    <Link href={"/instructions"} target="_blank">
                        <strong className="text-2xl text-red-500">Заавар үзэх</strong>
                    </Link>
                </p>
            </section>
            <section className="flex flex-col gap-4 justify-center md:max-w-[33%] w-full">
                <AuthSection />
            </section>
        </>
    );
}
