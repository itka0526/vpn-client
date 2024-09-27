import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { InfoBox } from "@/components/info-box";
import { ScrollTextIcon } from "lucide-react";

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
    title: "WireGuard VPN - @itka0526",
    description: "Nothing.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Toaster position="bottom-right" />
                <NextTopLoader showSpinner={false} color="#202020" shadow="0 0 10px #2299DD,0 0 5px #2299DD" />
                <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                    <InfoBox />
                    <main className="flex flex-col gap-8 row-start-2 h-full w-full max-md:justify-center items-center">{children}</main>
                    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                        <a
                            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                            href="/instructions"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ScrollTextIcon className="mr-2 h-4 w-4" />
                            Заавар
                        </a>
                    </footer>
                </div>
            </body>
        </html>
    );
}
