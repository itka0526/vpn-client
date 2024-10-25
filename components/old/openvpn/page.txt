import { CustomSection } from "@/components/ui/custom-section";
import { config } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <CustomSection>
                <details className="my-4">
                    <summary className="text-xl font-bold my-4">Агуулга</summary>
                    <ul>
                        <li>
                            <Link href={"#article-1"} className="font-semibold my-2">
                                1. Татах
                            </Link>
                        </li>
                        <li>
                            <Link href={"#article-2"} className="font-semibold my-2">
                                2. Бүртгүүлэх && нэвтрэх
                            </Link>
                        </li>{" "}
                        <li>
                            <Link href={"#article-3"} className="font-semibold my-2">
                                3. Түлхүүр үүсгэх
                            </Link>
                        </li>{" "}
                        <li>
                            <Link href={"#article-4"} className="font-semibold my-2">
                                4. Холбох (Компьютер)
                            </Link>
                        </li>{" "}
                        <li>
                            <Link href={"#article-5"} className="font-semibold my-2 mb-0">
                                5. Холбох (Утас)
                            </Link>
                        </li>
                    </ul>
                </details>
            </CustomSection>
            <article className="text-justify w-full md:px-24" id="article-1">
                <h2 className="text-xl font-bold my-4 mt-0">1. Татах</h2>
                <p>
                    Эхлээд{" "}
                    <Link href="https://openvpn.net/client/" target="_blank" rel="noopener noreferrer">
                        <strong>
                            <i>OpenVPN</i>
                        </strong>
                    </Link>{" "}
                    програмыг төхөөрөмж дээрээ суулгах хэрэгтэй болно. <br />
                    <Link href={"https://openvpn.net/client/"} target="_blank" rel="noopener noreferrer">
                        https://openvpn.net/client/
                    </Link>
                    Энэ програм нь VPN-ийг тохируулахад хялбар болгодог.
                </p>
            </article>
            <article className="text-justify w-full md:px-24" id="article-2">
                <h2 className="text-xl font-bold my-4">2. Бүртгүүлэх && нэвтрэх</h2>
                <p>
                    Дараа нь{" "}
                    <Link href={"/register"} target="_blank" rel="noopener noreferrer">
                        <i>бүртгүүлээд</i>
                    </Link>{" "}
                    <Link href={"/login"} target="_blank" rel="noopener noreferrer">
                        <i>нэвтэрсэний</i>
                    </Link>{" "}
                    дараа түлхүүр үүсгэх хэрэгтэй болно.
                </p>
            </article>
            <article className="text-justify w-full md:px-24" id="article-3">
                <h2 className="text-xl font-bold my-4">3. Түлхүүр үүсгэх</h2>
                <Image src={"/instruction-1.png"} priority width={512} height={512} alt="Creating a key." />
                <p>
                    Одоогоор хамгийн ихдээ {config.deviceLimitPerAcc} түлхүүр үүсгэж болно. Төхөөрөмж бүр өөрийн гэсэн түлхүүртэй байх ёстой, эс
                    бөгөөс төхөөрөмжүүдийн хооронд зөрчил үүсч, гацах болно.
                    <br />
                    <span className="text-blue-300 text-sm">(Системийг буруугаар ашиглахгүй байхыг хүсье)</span>
                </p>
            </article>
        </>
    );
}
