import axiosInstance from "@/shared/lib/axiosInstance";

export const createProject = (data) => axiosInstance.post("/project", data);
export const findProjectById = (projectId) =>
	axiosInstance.get(`/project/${projectId}`);
export const getUserProjects = () => axiosInstance.get("/project");
export const addUserToProject = (projectId, addedUserId) =>
	axiosInstance.post(`/project/${projectId}/user/${addedUserId}`);
