"use client";

import { useEffect, useState } from "react";
import { getEpicsByProject, createEpic } from "@/entities/epic/api";
import {
    createTask,
    addToEpic,
    getTasksByEpic,
    getTasksByProject,
    changeStatus,
    deleteTask as deleteTaskApi,
} from "@/entities/task/api";
import { ExpandableListCard } from "@/shared/ui/expandable-List-Card/expandable-List-Card";
import Button from "@/shared/ui/button/button";
import { InputField } from "@/shared/ui/input-field/input-field";

export default function TasksPage() {
    const [id, setId] = useState(null);
    const [epics, setEpics] = useState([]);
    const [generalTasks, setGeneralTasks] = useState([]);
    const [ready, setReady] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newTaskEpicId, setNewTaskEpicId] = useState("");

    async function fetchData() {
        const url = window.location.href;
        const idFromUrl = url.split("=")[1];
        setId(idFromUrl);
        setReady(false);

        await Promise.all([
            fetchEpics(idFromUrl),
            fetchGeneralTasks(idFromUrl),
        ]);

        setReady(true);
    }


    async function fetchEpics(projectId) {
        return getEpicsByProject(projectId).then(async (response) => {
            const epics = response.data;

            const epicsWithTasks = await Promise.all(
                epics.map(async (epic) => {
                    try {
                        const tasksResponse = await getTasksByEpic(projectId, epic.id);
                        return {
                            ...epic,
                            tasks: tasksResponse.data,
                        };
                    } catch (error) {
                        console.error("Error fetching tasks:", error);
                        return {
                            ...epic,
                            tasks: [],
                        };
                    }
                })
            );

            setEpics(epicsWithTasks);
        }).catch((error) => {
            console.error("Error fetching epics:", error);
        });
    }

    async function fetchGeneralTasks(projectId) {
        return getTasksByProject(projectId)
            .then((response) => {
                const tasks = response.data;
                setGeneralTasks(
                    tasks.filter((task) => task.epic == null)
                );
            })
            .catch((error) => {
                console.error("Error fetching general tasks:", error);
                setGeneralTasks([]);
            });
    }

    async function updateTaskStatus(taskId, nextStatus) {
        changeStatus(taskId, id, nextStatus).then((response) => {
            fetchData();
        }).catch((error) => {
            console.error("Error updating task status:", error);
        });
    }

    async function handleDeleteTask(task) {
        deleteTaskApi(task.id, id).then(() => {
            fetchData();
        }).catch((error) => {
            console.error("Error deleting task:", error);
        });
    }

    async function handleCreateTask() {
        createTask(id, {
            title: newTitle,
            description: newDescription
        }).then((response) => {
            console.log("Task created:", response.data);
            addToEpic(response.data.id, id, newTaskEpicId).then((res) => {
                console.log("Task added to epic:", res.data);
            }).catch((error) => {
                console.error("Error adding task to epic:", error);
            });
            setNewTitle("");
            setNewDescription("");
            setNewTaskEpicId("");
            fetchData();
            setViewMode("list");
        }).catch((error) => {
            console.error("Error creating task:", error);
        });
    }

    async function handleCreateEpic() {
        createEpic(id, {
            title: newTitle,
            description: newDescription
        }).then((response) => {
            console.log("Epic created:", response.data);
            setNewTitle("");
            setNewDescription("");
            fetchData();
            setViewMode("list");
        }).catch((error) => {
            console.error("Error creating epic:", error);
        });
    }

    async function changeViewMode(newMode) {
        setViewMode(newMode);
        setNewTitle("");
        setNewDescription("");
        setNewTaskEpicId("");
    }

    useEffect(() => {
        fetchData();
    }, [])
    useEffect(() => {
        console.log(epics);
    }, [epics])

    if (!ready) {
        return (
            <div className="w-full h-[100vh] flex items-center pt-20 pr-30 pl-30 bg-zinc-50 flex flex-col gap-y-40">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl text-black">Loading...</h1>
                </div>
            </div>
        );
    }

    if (viewMode === "list") {
        return (
            <div className="w-full h-[100vh] flex items-center pt-20 pr-30 pl-30 bg-zinc-50 flex flex-col gap-y-40">
                <div className="flex flex-col w-full items-center gap-2">
                    <h1 className="text-3xl text-black">Epics</h1>
                    <div className="w-[80%] p-4 border-2 border-[#6528FF] rounded-lg mb-4 flex flex-col items-start gap-4">
                        {epics.map((epic) => (
                            <ExpandableListCard
                                entity={epic}
                                list={epic.tasks ?? []}
                                statusOptions={["TODO", "IN_PROGRESS", "DONE"]}
                                onStatusChange={(task, status) => {
                                    updateTaskStatus(task.id, status);
                                }}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>

                    <h1 className="text-3xl text-black">General Tasks</h1>
                    <div className="w-[80%] p-4 border-2 border-[#6528FF] rounded-lg mb-4 flex flex-col items-start gap-4">
                        <ExpandableListCard
                            entity={{ id: "general-tasks", title: "General Tasks" }}
                            list={generalTasks}
                            statusOptions={["TODO", "IN_PROGRESS", "DONE"]}
                            onStatusChange={(task, status) => {
                                updateTaskStatus(task.id, status);
                            }}
                            onDelete={handleDeleteTask}
                            epicOptions={epics}
                            onAssignEpic={(task, epicId) => {
                                if (!epicId) return;
                                addToEpic(task.id, id, epicId)
                                    .then(() => fetchData())
                                    .catch((err) => console.error("Error assigning epic:", err));
                            }}
                        />
                    </div>

                    <div className="flex flex-row justify-between w-[80%]">
                        <Button text={"Create Task"} func={() => changeViewMode("task")} />
                        <Button text={"Create Epic"} func={() => changeViewMode("epic")} />
                    </div>
                </div>
            </div>
        );
    } else if (viewMode === "task") {
        return (
            <div className="w-full h-[100vh] flex items-center pt-20 pr-30 pl-30 bg-zinc-50 flex flex-col gap-y-40">
                <h1 className="text-3xl text-black">Task Creation Form</h1>
                <div className="flex flex-col w-full items-center gap-4">
                    <InputField placeholder="Task Title" value={newTitle} setValue={(value) => setNewTitle(value)} className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors" />
                    <InputField placeholder="Task Description" value={newDescription} setValue={(value) => setNewDescription(value)} className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors" />
                    <div className="w-full max-w-xl flex flex-col gap-2">
                        <label className="text-sm font-medium text-zinc-700">Epic</label>
                        <select
                            className="w-full rounded-xl border-2 border-[#D7CFF4] bg-white px-4 py-3 text-black outline-none transition-colors hover:border-[#6A4BD1]"
                            value={newTaskEpicId}
                            onChange={(e) => setNewTaskEpicId(e.target.value)}
                        >
                            <option value="">Without epic</option>
                            {epics.map((epic) => (
                                <option key={epic.id} value={epic.id}>
                                    {epic.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <Button text={"Create Task"} func={handleCreateTask} />
                <Button text={"Back to List"} func={() => changeViewMode("list")} />
            </div>
        );
    } else if (viewMode === "epic") {
        return (
            <div className="w-full h-[100vh] flex items-center pt-20 pr-30 pl-30 bg-zinc-50 flex flex-col gap-y-40">
                <h1 className="text-3xl text-black">Epic Creation Form (TODO)</h1>
                <div className="flex flex-col w-full items-center gap-4">
                    <InputField placeholder="Task Title" value={newTitle} setValue={(value) => setNewTitle(value)} className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors" />
                    <InputField placeholder="Task Description" value={newDescription} setValue={(value) => setNewDescription(value)} className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors" />
                </div>
                <Button text={"Create Task"} func={handleCreateEpic} />
                <Button text={"Back to List"} func={() => changeViewMode("list")} />
            </div>
        );
    }
}