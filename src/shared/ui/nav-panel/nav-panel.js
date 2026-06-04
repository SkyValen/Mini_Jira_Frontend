"use client";

import { useState, useEffect } from "react";

export function NavPanel() {
    const [id, setId] = useState(null);
    useEffect(() => {
        const url = window.location.href;
        const idFromUrl = url.split("=")[1];
        setId(idFromUrl);
    }, [])

    useEffect(() => {
        console.log(id);
    }, [id])
    return (
        <div className="w-[20%] h-[100vh] border-r-4 border-[#6528FF] bg-zinc-50 p-4 flex flex-col items-start z-10 whitespace-pre-line">
            <h2 className="text-2xl font-bold mb-4 text-[#6528FF]">{"Navigation\n panel"}</h2>
            <ul className="space-y-5">
                <li>
                    <a href={`/project?id=${id}`} className="text-[#6528FF] hover:underline">
                        Projects
                    </a>
                </li>
                <li>
                    <a href={`/tasks?id=${id}`} className="text-[#6528FF] hover:underline">
                        Tasks
                    </a>
                </li>
                <li>
                    <a href="/sprints" className="text-[#6528FF] hover:underline">
                        Sprints
                    </a>
                </li>
            </ul>
        </div>
    );
}