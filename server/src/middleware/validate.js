import { ApiError } from '../utils/apiError.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(ApiError.badRequest('Validation failed on request payload', details));
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(ApiError.badRequest('Validation failed on query parameters', details));
    }
    // Express 5 defines req.query as a getter; mutate in-place
    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }
    Object.assign(req.query, result.data);
    next();
  };
}

export function validateObjectId(paramName = 'id') {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !objectIdRegex.test(id)) {
      return next(
        new ApiError(
          400,
          `Invalid identifier format for parameter '${paramName}'. Must be a 24-character hexadecimal string.`,
          'INVALID_ID'
        )
      );
    }
    next();
  };
}
