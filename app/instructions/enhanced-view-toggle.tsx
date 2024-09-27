"use client";

import { Dispatch, SetStateAction } from "react";
import { Smartphone, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export function EnhancedViewToggleComponent({ state, setState }: { state: boolean; setState: Dispatch<SetStateAction<boolean>> }) {
    return (
        <button
            onClick={() => setState((p) => !p)}
            className={`relative w-28 h-12 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                state ? "bg-primary" : "bg-secondary"
            }`}
            aria-pressed={state}
            aria-label={state ? "Switch to desktop view" : "Switch to mobile view"}
        >
            <motion.div
                className="absolute inset-1 flex items-center justify-center"
                initial={false}
                animate={{ x: state ? "calc(50% - 1.5rem)" : "calc(-50% + 1.5rem)" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                <div className={`w-10 h-10 rounded-full ${state ? "bg-white" : "bg-primary"} shadow-lg flex items-center justify-center`}>
                    {state ? <Smartphone className="w-6 h-6 text-primary" /> : <Monitor className="w-6 h-6 text-white" />}
                </div>
            </motion.div>
            <div className="flex items-center justify-between h-full px-4"></div>
        </button>
    );
}
