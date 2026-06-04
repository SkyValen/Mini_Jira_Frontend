"use client";
import { ExpandableListCard } from "@/shared/ui/expandable-List-Card/expandable-List-Card";
import { useState, useEffect } from "react";
import { getUserInvites, acceptInvite, denyInvite } from "@/entities/projectInvite/api";

export default function InvitePage() {
    const [invites, setInvites] = useState([]);

    async function fetchInvites() {
        getUserInvites().then((response) => {
            for (let invite of response.data) {
                invite.title = `User ${invite.invitedBy.username} invited you to project ${invite.project.name}`;
                const diffMs = Date.now() - new Date(invite.createdAt).getTime();
                if (diffMs < 60000) {
                    invite.timeAgo = `${Math.floor(diffMs / 1000)} seconds ago`;
                } else if (diffMs < 3600000) {
                    invite.timeAgo = `${Math.floor(diffMs / 60000)} minutes ago`;
                } else if (diffMs < 86400000) {
                    invite.timeAgo = `${Math.floor(diffMs / 3600000)} hours ago`;
                } else {
                    invite.timeAgo = `${Math.floor(diffMs / 86400000)} days ago`;
                }
            }
            setInvites(response.data);
        }).catch((error) => {
            console.error("Error fetching invites:", error);
        });
    }
    async function updateInviteStatus(taskId, status) {
        if (status === "ACCEPTED") {
            acceptInvite(taskId).then((response) => {
                console.log("Invite accepted:", response.data);
                fetchInvites();
            }).catch((error) => {
                console.error("Error accepting invite:", error);
            });
        } else if (status === "DENIED") {
            denyInvite(taskId).then((response) => {
                console.log("Invite denied:", response.data);
                fetchInvites();
            }).catch((error) => {
                console.error("Error denying invite:", error);
            });
        }
    }
    useEffect(() => {
        fetchInvites();
    }, [])
    useEffect(() => {
        console.log(invites);
    }, [invites])
    return (
        <div className="w-full h-[100vh] flex items-center pt-20 pr-30 pl-30 bg-zinc-50 flex flex-col gap-y-40">
            <div className="flex flex-col items-center gap-2 w-full min-h-0">
                <div className="w-[80%] p-4 border-2 border-[#6528FF] rounded-lg mb-4 flex flex-col items-start gap-4">
                    <ExpandableListCard
                        entity={{ id: "general-tasks", title: "Your Invites" }}
                        list={invites}
                        statusOptions={["IN_PROGRESS", "ACCEPTED", "DENIED"]}
                        onStatusChange={(task, status) => {
                            updateInviteStatus(task.id, status);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}