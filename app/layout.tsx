import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
// import { InfoBox } from "@/components/info-box";
import { Contact, ScrollTextIcon } from "lucide-react";
import Link from "next/link";
// import Welcome from "@/components/welcome";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "🔥Гал VPN🔥 - @itka0526",
    description: "Интернэтийн хязгаарлалтыг давхад зориулав.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="mn">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {/* <Welcome /> */}
                <Toaster position="bottom-right" />
                <NextTopLoader showSpinner={false} color="#202020" shadow="0 0 10px #2299DD,0 0 5px #2299DD" />
                <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 md:p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                    {/* <InfoBox /> */}
                    <main className="max-md:justify-center flex flex-col items-center w-full h-full row-start-2 gap-8">{children}</main>
                    <footer className="flex flex-wrap items-center justify-center row-start-3 gap-8">
                        <Link
                            className="hover:underline hover:underline-offset-4 flex items-center gap-2"
                            href="/instructions"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ScrollTextIcon className="w-4 h-4 mr-1" />
                            Заавар
                        </Link>
                        <Link className="hover:underline hover:underline-offset-4 flex items-center gap-2" href="/contacts">
                            <Contact className="w-4 h-4 mr-1" />
                            Холбогдох
                        </Link>
                    </footer>
                </div>
            </body>
        </html>
    );
}
