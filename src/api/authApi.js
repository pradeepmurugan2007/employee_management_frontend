import axiosClient from './axiosClient';

export const login = (username, password) =>
  axiosClient.post('/api/Todo/login', { username, password });
export const signup = (username, password) =>
  axiosClient.post('/api/Todo/signup', { username, password });
export const forgotPassword = (username) =>
  axiosClient.post('/api/Todo/forgot-password', { username });
export const resetPassword = (username, password) =>
  axiosClient.post('/api/Todo/reset-password', { username, password });
