"use client";

import { useState } from "react";
import { EnhancedViewToggleComponent } from "./enhanced-view-toggle";
import { XIcon } from "lucide-react";

export function Videos() {
    const [state, setState] = useState(false);
    const [open, setOpen] = useState(true);
    return (
        <>
            {open && (
                <div className="fixed z-50 inset-0 w-screen h-screen bg-[rgba(255,255,255,0.2)] flex justify-center items-center">
                    <div className="absolute top-8 right-8" onClick={() => setOpen(false)}>
                        <XIcon width={48} height={48} color="red" className="hover:rotate-90 transition-transform cursor-pointer" />
                    </div>
                    <div className="rounded-md shadow-md p-4 bg-black flex flex-col items-center justify-center gap-4">
                        <div>
                            <EnhancedViewToggleComponent state={state} setState={setState} />
                        </div>
                        <div className="flex justify-center items-center h-full w-full">
                            {!state ? (
                                <div>
                                    <video className="object-fill max-h-[44rem]" controls>
                                        <source src="/komputer.mp4" />
                                    </video>
                                </div>
                            ) : (
                                <video className="object-fill max-h-[44rem]" controls>
                                    <source src="/utas.mp4" />
                                </video>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <button className="font-bold text-xl text-red-500 bg-red-50 px-4 py-2 rounded-md my-4" onClick={() => setOpen(true)}>
                Заавар үзэх
            </button>
        </>
    );
}
