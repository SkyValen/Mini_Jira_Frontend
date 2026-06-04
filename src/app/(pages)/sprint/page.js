"use client";

import { useState, useEffect } from "react";
import { getSprintByProject, endActiveSprint } from "@/entities/sprint/api";
import { getEpicsBySprint } from "@/entities/epic/api";
import { getTasksByEpic } from "@/entities/task/api";
import Button from "@/shared/ui/button/button";
import { ExpandableListCard } from "@/shared/ui/expandable-List-Card/expandable-List-Card";

export default function SprintPage() {
    const [id, setId] = useState(null);
    const [sprints, setSprints] = useState([]);
    const [ready, setReady] = useState(false);

    async function fetchData() {
        try {
            const projectId = window.location.href.split("?id=")[1];
            setId(projectId);
            setReady(false);
            await fetchAllSprints(projectId);
        } catch (error) {
            console.error("Error fetching sprint data:", error);
        } finally {
            setReady(true);
        }
    }

    async function fetchAllSprints(projectId) {
        try {
            const sprintsResponse = (await getSprintByProject(projectId)).data;
            const sprintsWithNestedData = await Promise.all(
                sprintsResponse.map(async (sprint) => {
                    const epicsResponse = (await getEpicsBySprint(projectId, sprint.id)).data;
                    const epicsWithTasks = await Promise.all(
                        epicsResponse.map(async (epic) => {
                            try {
                                const tasksResponse = (await getTasksByEpic(projectId, epic.id)).data;
                                return {
                                    ...epic,
                                    title: epic.title ?? epic.name ?? `Epic ${epic.id}`,
                                    tasks: tasksResponse.map((task) => ({
                                        ...task,
                                        title: task.title ?? task.name ?? `Task ${task.id}`,
                                    })),
                                };
                            } catch (error) {
                                console.error("Error fetching tasks for epic:", error);
                                return {
                                    ...epic,
                                    title: epic.title ?? epic.name ?? `Epic ${epic.id}`,
                                    tasks: [],
                                };
                            }
                        })
                    );

                    return {
                        ...sprint,
                        title: sprint.title ?? sprint.name ?? `Sprint ${sprint.id}`,
                        epics: epicsWithTasks,
                    };
                })
            );

            setSprints(sprintsWithNestedData);
        } catch (error) {
            console.error("Error fetching sprints:", error);
        }
    }

    async function endActiveSprint() {
        try {
            endActiveSprint(id)
        } catch (error) {
            console.error("Error ending active sprint:", error);
        } finally {
            fetchData();
        }

    }

    useEffect(() => {
        fetchData();
    }, [])

    if (!ready) {
        return (
            <div className="w-full h-[100vh] flex items-center pt-20 pr-30 pl-30 bg-zinc-50 flex flex-col gap-y-40">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl text-black">Loading...</h1>
                </div>
            </div>
        );
    }

    const activeSprint = sprints.find((sprint) => sprint.active === true) ?? null;
    const otherSprints = sprints.filter((sprint) => sprint.active !== true);

    return (
        <div className="w-full h-[100vh] flex items-center pt-20 pr-30 pl-30 bg-zinc-50 flex flex-col gap-y-40">
            <div className="flex flex-col items-center gap-4 w-full min-h-0 border-2 border-[#6528FF] rounded-lg p-4">
                <h1 className="text-2xl text-black">Sprints</h1>
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full p-4 border-2 border-[#6528FF] rounded-lg bg-white flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-black">Active sprint</h2>
                            <Button text={"end Sprint"} func={endActiveSprint} />
                        </div>
                        <ExpandableListCard
                            entity={{ id: "active-sprint", title: "Active Sprint" }}
                            list={activeSprint ? [activeSprint] : []}
                            hierarchyKeys={["epics", "tasks"]}
                        />
                    </div>

                    <div className="w-full p-4 border-2 border-[#6528FF] rounded-lg bg-white flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold text-black">Other sprints</h2>
                        <ExpandableListCard
                            entity={{ id: "other-sprints", title: "All other sprints" }}
                            list={otherSprints}
                            hierarchyKeys={["epics", "tasks"]}
                        />
                    </div>
                </div>
            </div>

            {activeSprint ? null : (
                <div>
                    <Button text={"Create sprint"} />
                </div>
            )}
        </div>
    );
}