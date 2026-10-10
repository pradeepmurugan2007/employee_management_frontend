import axiosClient from './axiosClient';

export const getAttendance = (params = {}) => axiosClient.get('/api/attendance', { params });
export const markAttendance = (data) => axiosClient.post('/api/attendance', data);
export const updateAttendance = (id, data) => axiosClient.put(`/api/attendance/${id}`, data);
export const getAttendanceSummary = (date) => axiosClient.get('/api/attendance/summary', { params: { date } });
