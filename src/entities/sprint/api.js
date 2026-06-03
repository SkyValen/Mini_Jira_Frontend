import axiosInstance from "@/shared/lib/axiosInstance";

export const startNewSprint = (projectId, data) =>
	axiosInstance.post(`/sprint/project/${projectId}`, data);

export const getActiveSprint = (projectId) =>
	axiosInstance.get(`/sprint/project/${projectId}/active`);

export const getSprintByProject = (projectId) =>
	axiosInstance.get(`/sprint/project/${projectId}`);

export const endActiveSprint = (projectId) =>
	axiosInstance.patch(`/sprint/project/${projectId}`);
