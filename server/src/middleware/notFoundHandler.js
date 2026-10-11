import { ApiError } from '../utils/apiError.js';

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Cannot find endpoint ${req.method} ${req.originalUrl}`));
}
