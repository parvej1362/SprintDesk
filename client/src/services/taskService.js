import { api } from './api';

export const taskService = {
  async getTasks(params = {}) {
    const res = await api.get('/tasks', params);
    return res;
  },

  async getTaskById(id) {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  async createTask(payload) {
    const res = await api.post('/tasks', payload);
    return res.data;
  },

  async updateTask(id, payload) {
    const res = await api.patch(`/tasks/${id}`, payload);
    return res.data;
  },

  async deleteTask(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res;
  },
};
