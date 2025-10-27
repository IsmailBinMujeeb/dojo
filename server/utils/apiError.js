export default class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.message;
    this.data = null;
    this.errors = errors;
    this.success = false;
  }

  static BAD_REQUEST = (message = 'Bad Request') => new ApiError(400, message);

  static UNAUTHORIZED = (message = 'Unauthorized') => new ApiError(401, message);

  static FORBIDDEN = (message = 'Forbidden') => new ApiError(403, message);

  static NOT_FOUND = (message = 'Not Found') => new ApiError(404, message);

  static CONFLICT = (message = 'Conflict') => new ApiError(409, message);

  static INTERNAL_SERVER_ERROR = (message = 'Internal Server Error') => new ApiError(500, message);
}
