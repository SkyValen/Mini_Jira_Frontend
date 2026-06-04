"use client";

import { useEffect, useState } from "react";
import { findProjectById } from "@/entities/project/api";

export default function ProjectPage() {
    const [project, setProject] = useState(null);
    const [ready, setReady] = useState(false);
    async function fetchData() {
        let id = (window.location.href).split("?id=")[1];
        findProjectById(id).then((response) => {
            setProject(response.data);
        }).catch((error) => {
            console.error("Error fetching project data:", error);
        }).finally(() => {
            setReady(true);
        });
    }
    useEffect(() => {
        fetchData();
    }, [])
    useEffect(() => {
        console.log(project);
    }, [project])
    if (!ready || !project) {
        return (
            <div className="w-full h-[100vh] flex items-center pt-20 pr-30 pl-30 bg-zinc-50 flex flex-col gap-y-40">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl text-black">Loading...</h1>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full h-[100vh] flex items-center pt-20 pr-30 pl-30 bg-zinc-50 flex flex-col gap-y-40">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-3xl text-black">Projects Name:</h1>
                <h1 className="text-2xl font-bold text-[#6528FF]">{project.name}</h1>
            </div>
            <div className="flex flex-col items-center gap-2 w-full flex-1 min-h-0">
                <h1 className="text-2xl text-black">Description:</h1>
                <div className="w-full flex-1 min-h-0 overflow-auto flex items-start justify-center">
                    <p className="text-lg max-w-[80%] text-zinc-600 whitespace-normal break-words">
                        {project?.description}
                    </p>
                </div>
            </div>
        </div>
    );
}