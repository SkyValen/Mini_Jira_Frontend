import axiosInstance from "@/shared/lib/axiosInstance";

export const createInvite = (projectId, userId) =>
	axiosInstance.post(`/invite/project/${projectId}/user/${userId}`);

export const getUserInvites = () => axiosInstance.get("/invite/me");

export const getInvitesToProject = (projectId) =>
	axiosInstance.get(`/invite/project/${projectId}`);

export const acceptInvite = (inviteId) =>
	axiosInstance.patch(`/invite/${inviteId}/accept`);

export const denyInvite = (inviteId) =>
	axiosInstance.patch(`/invite/${inviteId}/deny`);
