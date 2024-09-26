"use client";

import { InfoIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function InfoBox() {
    const [open, setOpen] = useState(false);
    return (
        <>
            {open && (
                <div className="fixed z-50 inset-0 w-screen h-screen bg-[rgba(255,255,255,0.2)] flex justify-center items-center">
                    <div className="absolute top-8 right-8" onClick={() => setOpen(false)}>
                        <XIcon width={48} height={48} color="black" className="hover:rotate-90 transition-transform cursor-pointer" />
                    </div>
                    <div className="rounded-md shadow-md p-4 bg-black pointer-events-none flex items-center flex-col gap-4">
                        <Image src="/sber.jpg" alt="+7(977) 104 11-42" width={280} height={280} />
                        <div>
                            <p className="text-lg">Сбер банк</p>
                        </div>
                        <p>Альфа банк +7 (977) 104 11-42</p>
                    </div>
                </div>
            )}
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r" role="alert" aria-live="polite">
                <div className="flex items-center">
                    <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" />
                    <p>
                        Хэрэв та хөгжүүлэгчийг дэмжихийг хүсвэл.{" "}
                        <button onClick={() => setOpen(true)}>
                            <strong className="cursor-pointer">Энд дарна уу.</strong>
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}
