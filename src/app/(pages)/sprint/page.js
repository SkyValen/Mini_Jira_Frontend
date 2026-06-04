"use client";

import { useState, useEffect } from "react";
import { getActiveSprint } from "@/entities/sprint/api";
import Button from "@/shared/ui/button/button";
import { ExpandableListCard } from "@/shared/ui/expandable-List-Card/expandable-List-Card";

export default function SprintPage() {
    const [id, setId] = useState(null);
    const [activeSprint, setActiveSprint] = useState(null);
    const [ready, setReady] = useState(false);

    async function fetchData() {
        const id = window.location.href.split("?id=")[1];
        setId(id);
        setReady(false);
        getActiveSprint(id).then((response) => {
            setActiveSprint(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.error("Error fetching active sprint:", error);
        }).finally(() => {
            setReady(true);
        });
    }

    useEffect(() => {
        fetchData();
    }, [])

    const sprintTasks = activeSprint?.tasks ?? activeSprint?.taskList ?? activeSprint?.taskDtos ?? [];
    const sprintEpics = activeSprint?.epics ?? activeSprint?.epicList ?? activeSprint?.epicDtos ?? (activeSprint?.epic ? [activeSprint.epic] : []);

    const normalizedTasks = sprintTasks.map((task) => ({
        ...task,
        title: task.title ?? task.name ?? "Untitled task",
    }));

    const normalizedEpics = sprintEpics.map((epic) => ({
        ...epic,
        title: epic.title ?? epic.name ?? "Untitled epic",
        status: epic.description ?? epic.status ?? "",
    }));

    if (!ready) {
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
            <div className="flex flex-col items-center gap-4 w-full min-h-0 border-2 border-[#6528FF] rounded-lg p-4">
                <h1 className="text-2xl text-black">Active sprint</h1>
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full p-4 border-2 border-[#6528FF] rounded-lg bg-white flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold text-black">Tasks in sprint</h2>
                        <ExpandableListCard
                            entity={{ id: "sprint-tasks", title: "Sprint Tasks" }}
                            list={normalizedTasks}
                        />
                    </div>

                    <div className="w-full p-4 border-2 border-[#6528FF] rounded-lg bg-white flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold text-black">Epics in sprint</h2>
                        <ExpandableListCard
                            entity={{ id: "sprint-epics", title: "Sprint Epics" }}
                            list={normalizedEpics}
                        />
                    </div>
                </div>
            </div>

            {activeSprint ? null : (
                <div>
                    <Button text={"Create sprint"} func={() => window.location.replace(`/projects?id=${id}`)} />
                </div>
            )}
        </div>
    );
}