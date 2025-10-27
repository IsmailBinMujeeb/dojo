export default class ApiResponse {
  constructor(statusCode, message, data = [], errors = []) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.success = statusCode >= 200 && statusCode < 300;
  }
}
