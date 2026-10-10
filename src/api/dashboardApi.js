import axiosClient from './axiosClient';

export const getDashboardSummary = (date) =>
  axiosClient.get('/api/dashboard/summary', { params: date ? { date } : {} });
export const getRecentEmployees = (limit = 5) =>
  axiosClient.get('/api/dashboard/recent-employees', { params: { limit } });
export const getPendingLeaves = (limit = 5) =>
  axiosClient.get('/api/dashboard/pending-leaves', { params: { limit } });
export const getDepartmentStats = () =>
  axiosClient.get('/api/dashboard/departments');
