import axiosInstance from "@/shared/lib/axiosInstance";

export const createEpic = (projectId, data) =>
	axiosInstance.post(`/epic/project/${projectId}`, data);

export const getEpicById = (epicId, projectId) =>
	axiosInstance.get(`/epic/${epicId}/project/${projectId}`);

export const getEpicsByProject = (projectId) =>
	axiosInstance.get(`/epic/project/${projectId}`);

export const deleteEpic = (epicId, projectId) =>
	axiosInstance.delete(`/epic/${epicId}/project/${projectId}`);
