import axiosClient from './axiosClient';

export const getNotifications = async () => {
  const response = await axiosClient.get('/api/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await axiosClient.put(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosClient.put('/api/notifications/read-all');
  return response.data;
};
