export class ApiResponse {
  static success<T>(data: T, message = 'Request successful', meta?: unknown) {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static error(message = 'Something went wrong', errors: unknown = null) {
    return {
      success: false,
      message,
      errors,
    };
  }
}
