"use client";

import { useState, useEffect } from "react";
import { getSprintByProject, endActiveSprint, startNewSprint } from "@/entities/sprint/api";
import { getEpicsBySprint, getEpicsByProject, assignEpicToSprint } from "@/entities/epic/api";
import { getTasksByEpic } from "@/entities/task/api";
import Button from "@/shared/ui/button/button";
import { ExpandableListCard } from "@/shared/ui/expandable-List-Card/expandable-List-Card";
import { InputField } from "@/shared/ui/input-field/input-field";

export default function SprintPage() {
    const [projectId, setProjectId] = useState("");
    const [sprints, setSprints] = useState([]);
    const [ready, setReady] = useState(false);
    const [newSprintTitle, setNewSprintTitle] = useState("");
    const [nonAssignedEpics, setNonAssignedEpics] = useState([]);
    const [selectedEpics, setSelectedEpics] = useState([]);

    async function fetchData() {
        try {
            setReady(false);
            let id = (window.location.href).split("?id=")[1];
            setProjectId(id);
            await fetchAllSprints(id);
            await findNonAssignedEpics(id);
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

    async function endCurrentActiveSprint() {
        try {
            await endActiveSprint(projectId);
            await fetchData();
        } catch (error) {
            console.error("Error ending active sprint:", error);
        }

    }

    async function createNewSprint() {
        try {
            await startNewSprint(projectId, { name: newSprintTitle });
            setNewSprintTitle("");
            await fetchData();
        } catch (error) {
            console.error("Error creating new sprint:", error);
        }
    }

    async function findNonAssignedEpics(projectId) {
        try {
            const epicsResponse = (await getEpicsByProject(projectId)).data;
            const nonAssignedEpics = epicsResponse.filter((epic) => epic.sprint === null);
            console.log("Non-assigned epics:", epicsResponse, nonAssignedEpics);
            setNonAssignedEpics(nonAssignedEpics);
        } catch (error) {
            console.error("Error fetching non-assigned epics:", error);
        }
    }

    function toggleEpic(epicId) {
        setSelectedEpics(prev =>
            prev.includes(epicId)
                ? prev.filter(id => id !== epicId)
                : [...prev, epicId]
        );
    }

    async function addSelectedEpicsToSprint() {
        try {
            for (const epicId of selectedEpics) {
                await assignEpicToSprint(epicId, projectId);
                console.log(`Epic ${epicId} assigned to active sprint`);
            }
            fetchData();
        } catch (error) {
            console.error("Error adding epics to sprint:", error);
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
            {activeSprint ? null : (
                <div className="flex flex-col items-center min-h-[143px] gap-4 w-full min-h-0 border-2 border-[#6528FF] rounded-lg p-4">
                    <InputField placeholder={"Введите название спринта"} value={newSprintTitle} setValue={(value) => setNewSprintTitle(value)} className={"!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"} />
                    <Button text={"Create sprint"} func={createNewSprint} />
                </div>
            )}
            <div className="w-full p-4 border-2 border-[#6528FF] rounded-lg bg-white flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-black">Add epics to sprint</h2>
                <div>
                    {activeSprint ? (
                        nonAssignedEpics.map(epic => (
                            <div key={epic.id}>
                                <label className={`text-[#6528FF] flex flex-row gap-2`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedEpics.includes(epic.id)}
                                        onChange={() => toggleEpic(epic.id)}
                                    />
                                    <p className={`${selectedEpics.includes(epic.id) ? "ring-1 ring-[#6528FF]" : ""}`}>{epic.title}</p>
                                </label>
                            </div>
                        ))
                    ) : null}
                </div>
                <Button text={"Add selected epics to active sprint"} func={addSelectedEpicsToSprint} />
            </div>
            <div className="flex flex-col items-center gap-4 w-full min-h-[386px] border-2 border-[#6528FF] rounded-lg p-4">
                <h1 className="text-2xl text-black">Sprints</h1>
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full p-4 border-2 border-[#6528FF] rounded-lg bg-white flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-black">Active sprint</h2>
                            {activeSprint ? (
                                <Button text={"end Sprint"} func={endCurrentActiveSprint} />
                            ) : null}
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
        </div>
    );
}