import axiosClient from './axiosClient';

export const getEmployees = (params = {}) => axiosClient.get('/api/employees', { params });
export const getEmployeeById = (id) => axiosClient.get(`/api/employees/${id}`);
export const createEmployee = (data) => axiosClient.post('/api/employees', data);
export const updateEmployee = (id, data) => axiosClient.put(`/api/employees/${id}`, data);
export const updateEmployeeStatus = async (id, status) => {
  try {
    return await axiosClient.patch(`/api/employees/${id}/status`, { status });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Fallback to PUT if PATCH endpoint doesn't exist on the production backend yet
      const res = await axiosClient.get(`/api/employees/${id}`);
      const emp = res.data;
      emp.status = status;
      return axiosClient.put(`/api/employees/${id}`, emp);
    }
    throw error;
  }
};
export const deleteEmployee = (id) => axiosClient.delete(`/api/employees/${id}`);
