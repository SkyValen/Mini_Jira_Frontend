import axiosInstance from "@/shared/lib/axiosInstance";

export const createComment = (taskId, projectId, text) =>
	axiosInstance.post(`/comment/task/${taskId}/project/${projectId}`, text);

export const getCommentsByTask = (taskId, projectId) =>
	axiosInstance.get(`/comment/task/${taskId}/project/${projectId}`);

export const deleteComment = (commentId, projectId) =>
	axiosInstance.delete(`/comment/${commentId}/project/${projectId}`);
