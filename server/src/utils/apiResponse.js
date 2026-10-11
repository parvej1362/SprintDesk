export const ApiResponse = {
  success(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  },

  paginated(res, data, meta, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      meta,
      data,
    });
  },

  message(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data ? { data } : {}),
    });
  },
};
