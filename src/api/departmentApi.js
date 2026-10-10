import axiosClient from './axiosClient';

export const getDepartments = () => axiosClient.get('/api/departments');
export const getDepartmentById = (id) => axiosClient.get(`/api/departments/${id}`);
export const createDepartment = (data) => axiosClient.post('/api/departments', data);
export const updateDepartment = (id, data) => axiosClient.put(`/api/departments/${id}`, data);
export const updateDepartmentStatus = (id, status) => axiosClient.patch(`/api/departments/${id}/status`, { status });
export const deleteDepartment = (id) => axiosClient.delete(`/api/departments/${id}`);
