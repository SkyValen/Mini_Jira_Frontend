"use client";

import Button from "@/shared/ui/button/button";
import { InputField } from "@/shared/ui/input-field/input-field";
import { useState } from "react";
import { createProject } from "@/entities/project/api";

export default function AddProjectPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    async function goBack() {
        window.location.replace("/projects");
    }
    async function createNewProject() {
        createProject({ name, description }).then((response) => {
            console.log(response.data);
            goBack();
        }).catch((error) => {
            console.error("Error creating project:", error);
        });
    }
    return (
        <div className="flex flex-col gap-4 w-full min-h-screen bg-zinc-50 items-center justify-center">
            <div className="w-[clamp(500px,100%,700px)] flex flex-col gap-6 items-center justify-center">
                <Button text={"<< Go back"} func={goBack} />
                <h1 className="text-2xl font-bold">Add Project</h1>
                <InputField
                    placeholder="Введите название проекта"
                    value={name}
                    setValue={(value) => setName(value)}
                    className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"
                />
                <InputField
                    placeholder="Введите описание проекта"
                    value={description}
                    setValue={(value) => setDescription(value)}
                    className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"
                />
                <Button text={"Create Project"} func={createNewProject} />
            </div>
        </div>
    );
}