import axiosInstance from "@/shared/lib/axiosInstance";

// Task related
export const createTask = (projectId, data) =>
	axiosInstance.post(`/task/project/${projectId}`, data);

export const getTaskById = (taskId, projectId) =>
	axiosInstance.get(`/task/${taskId}/project/${projectId}`);

export const deleteTask = (taskId, projectId) =>
	axiosInstance.delete(`/task/${taskId}/project/${projectId}`);

export const getTasksByProject = (projectId) =>
	axiosInstance.get(`/task/project/${projectId}`);

export const changeStatus = (taskId, projectId, status) =>
	axiosInstance.patch(`/task/${taskId}/project/${projectId}/status/${status}`);

// Epic related
export const getTasksByEpic = (projectId, epicId) =>
	axiosInstance.get(`/task/project/${projectId}/epic/${epicId}`);

export const addToEpic = (taskId, projectId, epicId) =>
	axiosInstance.patch(`/task/${taskId}/project/${projectId}/epic/${epicId}`);

export const removeFromEpic = (taskId, projectId) =>
	axiosInstance.delete(`/task/${taskId}/project/${projectId}/epic`);

// Assignee related
export const getTasksByAssignee = (projectId, assigneeId) =>
	axiosInstance.get(`/task/project/${projectId}/assignee/${assigneeId}`);

export const assignUserToTask = (taskId, projectId, assigneeId) =>
	axiosInstance.patch(`/task/${taskId}/project/${projectId}/assignee/${assigneeId}`);

export const unassignUser = (taskId, projectId) =>
	axiosInstance.delete(`/task/${taskId}/project/${projectId}/assignee`);

// Sprint related
export const addToSprint = (taskId, projectId, sprintId) =>
	axiosInstance.patch(`/task/${taskId}/project/${projectId}/sprint/${sprintId}`);

export const removeFromSprint = (taskId, projectId) =>
	axiosInstance.delete(`/task/${taskId}/project/${projectId}/sprint`);
