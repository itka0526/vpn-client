import { Videos } from "@/app/instructions/videos";
import { config } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <section className="text-justify w-full">
                <Videos />
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
            </section>
            <article className="text-justify w-full" id="article-1">
                <h2 className="text-xl font-bold my-4 mt-0">1. Татах</h2>
                <p>
                    Эхлээд{" "}
                    <Link href="https://www.wireguard.com/install/" target="_blank" rel="noopener noreferrer">
                        <strong>
                            <i>WireGuard</i>
                        </strong>
                    </Link>{" "}
                    клиент програмыг төхөөрөмж дээрээ суулгах хэрэгтэй болно. <br />
                    <Link href={"https://www.wireguard.com/install/"} target="_blank" rel="noopener noreferrer">
                        https://www.wireguard.com/install/
                    </Link>
                </p>
            </article>
            <article className="text-justify w-full" id="article-2">
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
            <article className="text-justify w-full" id="article-3">
                <h2 className="text-xl font-bold my-4">3. Түлхүүр үүсгэх</h2>
                {/* <div className="my-4"> */}
                <Image src={"/instruction-1.png"} priority width={512} height={512} alt="Creating a key." />
                {/* </div> */}
                <p>
                    Одоогоор хамгийн ихдээ {config.deviceLimitPerAcc} түлхүүр үүсгэж болно. Төхөөрөмж бүр өөрийн гэсэн түлхүүртэй байх ёстой, эс
                    бөгөөс төхөөрөмжүүдийн хооронд зөрчил үүсч, гацах болно.
                    <br />
                    <span className="text-blue-300 text-sm">(Системийг буруугаар ашиглахгүй байхыг хүсье)</span>
                </p>
            </article>
            <article className="text-justify w-full" id="article-4">
                <h2 className="text-xl font-bold my-4">4. Холбох (Компьютер)</h2>
                <p>Хэрэв та компьютер дээр байгаа бол {'"Хуулах"'} товч дээр дарж тохиргоог хуулаад WireGuard програмаа нээнэ үү.</p>
                <p>Дараа нь {'"Add Empty Tunnel"'} гээд товчийн дарна уу.</p>
                <Image src={"/instruction-2.png"} alt="Adding configuration to a computer." width={512} height={512} className="my-4" />
                <p>
                    Та орлуулагч тохиргоог нь устгаад өмнө нь хуулсан текстээ хамгийн том <i>{'"[Interface]..."'}</i> гэсэн хайрцаг руу тавина уу.
                    {'"Name"'} гэсэн хайрцаганд юу ч тавиж болно, e.g., {'"minii_computer"'}. Дараа нь {'"Save"'} товчийг дарна уу.
                    <br />
                    <span className="text-blue-300 text-sm">({"ALT + A -> CTRL + P -> Save"})</span>
                </p>
                <Image
                    src={"/instruction-3.png"}
                    alt="Copying the configuration to an empty configuration."
                    width={512}
                    height={512}
                    className="my-4"
                />
                <p>
                    Ажиллуулахын тулд {'"minii_computer"'} дээр хоер удаа дарна уу <br />
                    <span className="text-blue-300 text-sm">(Ногоон гэрэл асах естой)</span>
                </p>
            </article>
            <article className="text-justify w-full" id="article-5">
                <h2 className="text-xl font-bold my-4">5. Холбох (Утас)</h2>
                <p>Өөр төхөөрөмжөөс бүртгэлдээ нэвтэрч, түлхүүрийн QR товчийг дарна уу.</p>
                <Image src={"/instruction-5.png"} alt="Choosing QR code." width={512} height={512} className="my-4" />
                <p>Дараа нь WireGuard програмаас QR кодыг уншуулна уу.</p>
                <Image src={"/instruction-6.jpg"} alt="Opening Wireguard app in your phone." width={512} height={512} className="my-4" />
            </article>
        </>
    );
}
