import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomSection } from "@/components/ui/custom-section";
import Link from "next/link";

export default function Page() {
    return (
        <CustomSection>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-10">Заавар</h1>
                <p className="my-4">
                    Хэрэв та төлбөрөө хугацаанд нь төлөөгүй бол түлхүүрүүд хүчингүй болж, устгагдах болно. Нэг төхөөрөмжинд нэг л түлхүүр байх естой.
                </p>
                <div className="grid gap-8">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle>
                                <h1 className="text-blue-400 hover:text-blue-300 transition-colors">OutlineVPN ашиглах</h1>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-gray-300">OutlineVPN нь VPN тохиргоог линкээр амархан суулгана.</p>
                            <ul className="text-blue-400 hover:text-blue-300 transition-colors">
                                <li>
                                    <Link href={"/instructions/iphone-outlinevpn"}>iPhone</Link>
                                </li>
                                <li>
                                    <Link href={"/instructions/macos-outlinevpn"}>macOS</Link>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle>
                                <h1 className="text-blue-400 hover:text-blue-300 transition-colors">OpenVPN ашиглах</h1>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-gray-300">OpenVPN нь VPN тохиргоог файлаар амархан суулгана.</p>
                            <ul className="text-blue-400 hover:text-blue-300 transition-colors">
                                <li>
                                    <Link href={"/instructions/android-openvpn"}>Android</Link>
                                </li>
                                <li>
                                    <Link href={"/instructions/iphone-openvpn"}>iPhone</Link>
                                </li>
                                <li>
                                    <Link href={"/instructions/macos-openvpn"}>macOS</Link>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle>
                                <h1 className="text-blue-400 hover:text-blue-300 transition-colors">Wireguard ашиглах</h1>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-gray-300">
                                Wireguard нь VPN тохиргоог QR кодоор хялбархан суулгана. Түлхүүр бүр зөвхөн нэг төхөөрөмжид зориулагдсан.
                            </p>
                            <Link href="/instructions/wireguard" className="text-blue-400 hover:text-blue-300 transition-colors">
                                Бүх платформууд
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CustomSection>
    );
}
