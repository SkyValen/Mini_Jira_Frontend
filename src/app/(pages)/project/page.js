"use client";

import { useEffect } from "react";
import { findProjectById } from "@/entities/project/api";

export default function ProjectPage() {
    async function fetchData() {
        let id = (window.location.href).split("?id=")[1];
        findProjectById(id).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.error("Error fetching project data:", error);
        });
    }
    useEffect(() => {
        fetchData();
    }, [])
        return (
            <div className="w-full h-full flex items-center justify-center">
                <h1 className="text-2xl font-bold">Project Page</h1>
            </div>
        );
    }