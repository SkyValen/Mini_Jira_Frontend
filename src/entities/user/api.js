import axiosInstance from '@/shared/lib/axiosInstance';

export const registerUser = (data) => axiosInstance.post('/user/register', data)
export const getUserById = (id) => axiosInstance.get(`/user/${id}`)
export const loginUser = (data) => axiosInstance.post('/user/login', data)