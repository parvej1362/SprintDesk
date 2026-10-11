import { api } from './api';

export const projectService = {
  async getProjects(params = {}) {
    const res = await api.get('/projects', params);
    return res;
  },

  async getProjectById(id) {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  async createProject(payload) {
    const res = await api.post('/projects', payload);
    return res.data;
  },

  async updateProject(id, payload) {
    const res = await api.patch(`/projects/${id}`, payload);
    return res.data;
  },

  async deleteProject(id, cascade = true) {
    const res = await api.delete(`/projects/${id}`, { cascade });
    return res;
  },
};
