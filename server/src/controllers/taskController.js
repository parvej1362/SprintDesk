import { taskService } from '../services/taskService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const taskController = {
  async getTasks(req, res, next) {
    try {
      const { tasks, meta } = await taskService.getTasks(req.query);
      return ApiResponse.paginated(res, tasks, meta);
    } catch (err) {
      next(err);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      return ApiResponse.success(res, task);
    } catch (err) {
      next(err);
    }
  },

  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.body);
      return ApiResponse.success(res, task, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      return ApiResponse.success(res, task);
    } catch (err) {
      next(err);
    }
  },

  async deleteTask(req, res, next) {
    try {
      const result = await taskService.deleteTask(req.params.id);
      return ApiResponse.message(res, 'Task deleted successfully.', result);
    } catch (err) {
      next(err);
    }
  },
};
