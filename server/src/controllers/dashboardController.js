import { dashboardService } from '../services/dashboardService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const dashboardController = {
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      return ApiResponse.success(res, summary);
    } catch (err) {
      next(err);
    }
  },
};
