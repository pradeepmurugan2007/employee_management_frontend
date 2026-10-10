import axiosClient from './axiosClient';

export const getEmployees = (params = {}) => axiosClient.get('/api/employees', { params });
export const getEmployeeById = (id) => axiosClient.get(`/api/employees/${id}`);
export const createEmployee = (data) => axiosClient.post('/api/employees', data);
export const updateEmployee = (id, data) => axiosClient.put(`/api/employees/${id}`, data);
export const updateEmployeeStatus = (id, status) => axiosClient.patch(`/api/employees/${id}/status`, { status });
export const deleteEmployee = (id) => axiosClient.delete(`/api/employees/${id}`);
