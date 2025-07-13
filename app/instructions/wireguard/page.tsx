import { CustomSection } from "@/components/ui/custom-section";
import { config } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { Videos } from "./videos";

export default function Page() {
    return (
        <div className="sm:px-6 lg:px-8 max-w-4xl px-4 mx-auto">
            <div className="prose-invert mx-auto prose prose-lg">
                <CustomSection>
                    <Videos />
                    <details className="my-4">
                        <summary className="my-4 text-xl font-bold">Агуулга</summary>
                        <ul>
                            <li>
                                <Link href={"#article-1"} className="my-2 font-semibold">
                                    1. Татах
                                </Link>
                            </li>
                            <li>
                                <Link href={"#article-2"} className="my-2 font-semibold">
                                    2. Бүртгүүлэх && нэвтрэх
                                </Link>
                            </li>{" "}
                            <li>
                                <Link href={"#article-3"} className="my-2 font-semibold">
                                    3. Түлхүүр үүсгэх
                                </Link>
                            </li>{" "}
                            <li>
                                <Link href={"#article-4"} className="my-2 font-semibold">
                                    4. Компьютер холбох
                                </Link>
                            </li>{" "}
                            <li>
                                <Link href={"#article-5"} className="my-2 mb-0 font-semibold">
                                    5. Утас холбох
                                </Link>
                            </li>
                        </ul>
                    </details>
                </CustomSection>
                <article className="md:px-24 w-full text-justify" id="article-1">
                    <p className="text-red-500">Нэг тохируулчах юм бол дахиж унтраах шаардлаггүй</p>
                    <h2 className="my-4 mt-0 text-xl font-bold">1. Татах</h2>
                    <p>
                        Эхлээд{" "}
                        <Link href="https://www.wireguard.com/install/" target="_blank" rel="noopener noreferrer">
                            <strong>
                                <i>WireGuard</i>
                            </strong>
                        </Link>{" "}
                        програмыг төхөөрөмж дээрээ суулгах хэрэгтэй болно. <br />
                        <Link href={"https://www.wireguard.com/install/"} target="_blank" rel="noopener noreferrer">
                            https://www.wireguard.com/install/
                        </Link>
                    </p>
                </article>
                <article className="md:px-24 w-full text-justify" id="article-2">
                    <h2 className="my-4 text-xl font-bold">2. Бүртгүүлэх && нэвтрэх</h2>
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
                <article className="md:px-24 w-full text-justify" id="article-3">
                    <h2 className="my-4 text-xl font-bold">3. Түлхүүр үүсгэх</h2>
                    <Image src={"/instruction-1.png"} priority width={512} height={512} alt="Creating a key." />
                    <p>
                        Одоогоор хамгийн ихдээ {config.deviceLimitPerAcc} түлхүүр үүсгэж болно. Төхөөрөмж бүр өөрийн гэсэн түлхүүртэй байх ёстой, эс
                        бөгөөс төхөөрөмжүүдийн хооронд зөрчил үүсч, гацах болно.
                        <br />
                        <span className="text-sm text-blue-300">(буруугаар ашиглахгүй байхыг хүсье)</span>
                    </p>
                </article>
                <article className="md:px-24 w-full text-justify" id="article-4">
                    <h2 className="my-4 text-xl font-bold">
                        4. <i>Компьютер</i> Холбох
                    </h2>
                    <p>Хэрэв та компьютер дээр байгаа бол {'"Хуулах"'} товч дээр дарж тохиргоог хуулаад WireGuard програмаа нээнэ үү.</p>
                    <p>Дараа нь {'"Add Empty Tunnel"'} гээд товчийн дарна уу.</p>
                    <Image src={"/instruction-2.png"} alt="Adding configuration to a computer." width={512} height={512} className="my-4" />
                    <p>
                        Та орлуулагч тохиргоог нь устгаад өмнө нь хуулсан текстээ хамгийн том <i>{'"[Interface]..."'}</i> гэсэн хайрцаг руу тавина уу.
                        {'"Name"'} гэсэн хайрцаганд юу ч тавиж болно, e.g., {'"minii_computer"'}. Дараа нь {'"Save"'} товчийг дарна уу.
                        <br />
                        <span className="text-sm text-blue-300">({"ALT + A -> CTRL + P -> Save"})</span>
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
                        <span className="text-sm text-blue-300">(Ногоон гэрэл асах естой)</span>
                    </p>
                </article>
                <article className="md:px-24 w-full text-justify" id="article-5">
                    <h2 className="my-4 text-xl font-bold">
                        5. <i>Утас</i> холбох{" "}
                    </h2>
                    <p>Өөр төхөөрөмжөөс бүртгэлдээ нэвтэрч, түлхүүрийн QR товчийг дарна уу.</p>
                    <p>
                        <i>Эсвэл компьютерийн заавартай адил файлийг татаж аваад WireGuard апликейшн дотроос 'Import' хийж тохируулж болно.</i>
                    </p>
                    <Image src={"/instruction-5.png"} alt="Choosing QR code." width={512} height={512} className="my-4" />
                    <p>Дараа нь WireGuard програмаас QR кодыг уншуулна уу.</p>
                    <Image src={"/instruction-6.jpg"} alt="Opening Wireguard app in your phone." width={512} height={512} className="my-4" />
                </article>
            </div>
        </div>
    );
}
