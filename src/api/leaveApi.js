import axiosClient from './axiosClient';

export const getLeaveRequests = (params = {}) => axiosClient.get('/api/leave-requests', { params });
export const getLeaveRequestById = (id) => axiosClient.get(`/api/leave-requests/${id}`);
export const createLeaveRequest = (data) => axiosClient.post('/api/leave-requests', data);
export const updateLeaveRequest = (id, data) => axiosClient.put(`/api/leave-requests/${id}`, data);
export const makeLeaveDecision = async (id, decision, comments) => {
  try {
    return await axiosClient.patch(`/api/leave-requests/${id}/decision`, { decision, comments, reviewedBy: 'Admin' });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Fallback to PUT if PATCH endpoint doesn't exist on the backend yet
      const res = await axiosClient.get(`/api/leave-requests/${id}`);
      const lr = res.data;
      lr.status = decision;
      lr.reviewComments = comments;
      lr.reviewedBy = 'Admin';
      return axiosClient.put(`/api/leave-requests/${id}`, lr);
    }
    throw error;
  }
};
export const deleteLeaveRequest = (id) => axiosClient.delete(`/api/leave-requests/${id}`);
