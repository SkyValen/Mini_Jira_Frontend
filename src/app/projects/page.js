"use client";

import { useEffect, useState } from "react";
import { getUserProjects } from "@/entities/project/api"
import { ListCard } from "@/shared/ui/list-card/list-card";
import Button from "@/shared/ui/button/button";

export default function Home() {
    const [projects, setProjects] = useState([]);

    async function fetchProjects() {
        await getUserProjects().then((response) => {
            setProjects(response.data);
        }).catch((error) => {
            console.error("Error fetching projects:", error);
        });
    }

    async function addProject() {
        window.location.replace("/projects/add");
    }
    useEffect(() => {
        fetchProjects();
    }, [])
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
            <main className="grid grid-cols-2 gap-4 justify-between w-[clamp(500px,100%,700px)] min-h-[150px] max-h-[250px] p-5 border-2 border-[#6528FF] rounded-lg overflow-y-auto">
                {projects.map((project) => (
                    <ListCard
                        key={project.id}
                        content={
                            <div className="flex flex-col gap-1 p-2">
                                <div className="font-semibold">{project.name}</div>
                                <div className="text-sm text-zinc-600">{project.description}</div>
                            </div>
                        }
                        onClick={() => window.location.href = `/project?id=${project.id}`}
                        className="text-[#6528FF] w-full"
                    />
                ))}
            </main>
            <div className="flex flex-row w-full justify-center max-w-3xl p-4">
                <Button text={"new project"} func={addProject}/>
            </div>
        </div>
    );
}
