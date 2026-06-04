"use client";

import { useEffect, useState } from "react";
import { findProjectById } from "@/entities/project/api";
import { createInvite } from "@/entities/projectInvite/api";
import Button from "@/shared/ui/button/button";
import { InputField } from "@/shared/ui/input-field/input-field";

export default function ProjectPage() {
    const [id, setId] = useState(null);
    const [project, setProject] = useState(null);
    const [ready, setReady] = useState(false);
    const [inviteUsername, setInviteUsername] = useState("");
    async function fetchData() {
        let id = (window.location.href).split("?id=")[1];
        setId(id);
        findProjectById(id).then((response) => {
            setProject(response.data);
        }).catch((error) => {
            console.error("Error fetching project data:", error);
        }).finally(() => {
            setReady(true);
        });
    }

    async function inviteUser() {
        createInvite(id, inviteUsername.toString()).then((response) => {
            console.log(response.data);
            setInviteUsername("");
        }).catch((error) => {
            console.error("Error inviting user:", error);
        });
    }

    useEffect(() => {
        fetchData();
    }, [])

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
            <div className="flex flex-col items-center gap-2 w-full border-2 border-[#6528FF] rounded-lg p-4">
                <h1 className="text-3xl text-black">Projects Name:</h1>
                <h1 className="text-2xl font-bold text-[#6528FF]">{project.name}</h1>
            </div>
            <div className="flex flex-col items-center gap-2 w-full min-h-0 border-2 border-[#6528FF] rounded-lg p-4">
                <h1 className="text-2xl text-black">Description:</h1>
                <div className="w-full flex-1 min-h-0 overflow-auto flex items-start justify-center">
                    <p className="text-lg max-w-[80%] text-zinc-600 whitespace-normal break-words">
                        {project?.description}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-center gap-4 w-full min-h-0 border-2 border-[#6528FF] rounded-lg p-4">
                <h1 className="text-2xl text-black">Invite user to your project</h1>
                <InputField placeholder={"Введите имя пользователя"} value={inviteUsername} setValue={(value) => setInviteUsername(value)} className={"!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"} />
                <Button text={"invite user"} func={inviteUser}/>
            </div>
        </div>
    );
}