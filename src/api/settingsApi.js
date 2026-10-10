import axiosClient from './axiosClient';

export const getSettings = async () => {
  const response = await axiosClient.get('/api/settings');
  return response.data;
};

export const updateSettings = async (settings) => {
  const response = await axiosClient.put('/api/settings', settings);
  return response.data;
};
