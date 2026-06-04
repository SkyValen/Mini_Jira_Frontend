"use client";

import { NavPanel } from "@/shared/ui/nav-panel/nav-panel";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }) {
    return (
        <div className="min-h-full w-full flex flex-row bg-zinc-50">
            <NavPanel />
            <div className="w-[20%]" />
            {children}
        </div>
    );
}