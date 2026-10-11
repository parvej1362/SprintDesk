import { Router } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/', (req, res) => {
  return ApiResponse.success(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
