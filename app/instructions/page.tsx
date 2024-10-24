import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomSection } from "@/components/ui/custom-section";
import Link from "next/link";

export default function Page() {
    return (
        <CustomSection>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-10">Заавар</h1>
                <p className="my-4">Хэрэв та төлбөрөө хугацаанд нь төлөөгүй бол түлхүүрүүд хүчингүй болж, устгагдах болно.</p>
                <div className="grid gap-8">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle>
                                <Link href="/instructions/openvpn" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    OpenVPN ашиглах
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300">OpenVPN нь VPN тохиргоог линкээр амархан суулгана.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle>
                                <Link href="/instructions/wireguard" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Wireguard ашиглах
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300">
                                Wireguard нь VPN тохиргоог QR кодоор хялбархан суулгана. Түлхүүр бүр зөвхөн нэг төхөөрөмжид зориулагдсан.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CustomSection>
    );
}
