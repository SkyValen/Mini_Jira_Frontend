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
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-zinc-50`}
        >
            <body className="min-h-full flex flex-row bg-zinc-50">
                <NavPanel />
                <div className="w-[20%]"/>
                {children}
            </body>
        </html>
    );
}