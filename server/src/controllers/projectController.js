import { projectService } from '../services/projectService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const projectController = {
  async getProjects(req, res, next) {
    try {
      const { projects, meta } = await projectService.getProjects(req.query);
      return ApiResponse.paginated(res, projects, meta);
    } catch (err) {
      next(err);
    }
  },

  async getProjectById(req, res, next) {
    try {
      const project = await projectService.getProjectById(req.params.id);
      return ApiResponse.success(res, project);
    } catch (err) {
      next(err);
    }
  },

  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.body);
      return ApiResponse.success(res, project, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateProject(req, res, next) {
    try {
      const project = await projectService.updateProject(req.params.id, req.body);
      return ApiResponse.success(res, project);
    } catch (err) {
      next(err);
    }
  },

  async deleteProject(req, res, next) {
    try {
      const cascade = req.query.cascade !== 'false';
      const result = await projectService.deleteProject(req.params.id, cascade);
      return ApiResponse.message(
        res,
        `Project and ${result.deletedTasksCount} associated tasks deleted successfully.`,
        result
      );
    } catch (err) {
      next(err);
    }
  },
};
