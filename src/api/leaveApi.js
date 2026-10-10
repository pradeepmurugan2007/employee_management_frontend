import axiosClient from './axiosClient';

export const getLeaveRequests = (params = {}) => axiosClient.get('/api/leave-requests', { params });
export const getLeaveRequestById = (id) => axiosClient.get(`/api/leave-requests/${id}`);
export const createLeaveRequest = (data) => axiosClient.post('/api/leave-requests', data);
export const updateLeaveRequest = (id, data) => axiosClient.put(`/api/leave-requests/${id}`, data);
export const makeLeaveDecision = (id, decision, comments) =>
  axiosClient.patch(`/api/leave-requests/${id}/decision`, { decision, comments, reviewedBy: 'Admin' });
export const deleteLeaveRequest = (id) => axiosClient.delete(`/api/leave-requests/${id}`);
