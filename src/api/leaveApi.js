import axiosClient from './axiosClient';

export const getLeaveRequests = (params = {}) => axiosClient.get('/api/leave-requests', { params });
export const getLeaveRequestById = (id) => axiosClient.get(`/api/leave-requests/${id}`);
export const createLeaveRequest = (data) => axiosClient.post('/api/leave-requests', data);
export const updateLeaveRequest = (id, data) => axiosClient.put(`/api/leave-requests/${id}`, data);
export const makeLeaveDecision = async (id, decision, comments) => {
  // Use GET + PUT directly instead of PATCH to avoid CORS/404 errors on the current production deployment
  const res = await axiosClient.get(`/api/leave-requests/${id}`);
  const lr = res.data;
  lr.status = decision;
  lr.reviewComments = comments;
  lr.reviewedBy = 'Admin';
  return axiosClient.put(`/api/leave-requests/${id}`, lr);
};
export const deleteLeaveRequest = (id) => axiosClient.delete(`/api/leave-requests/${id}`);
