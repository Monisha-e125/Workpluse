/**
 * Standardized API Response Handler
 * Ensures consistent response format across all endpoints
 */
class ApiResponse {

  /**
   * Success response (200)
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Created response (201)
   */
  static created(res, data = null, message = 'Created successfully') {
    return this.success(res, data, message, 201);
  }

  /**
   * No Content response (204)
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Error response (generic)
   */
  static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Bad Request (400)
   */
  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, message, 400, errors);
  }

  /**
   * Unauthorized (401)
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, 401);
  }

  /**
   * Forbidden (403)
   */
  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, message, 403);
  }

  /**
   * Not Found (404)
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  /**
   * Conflict (409) — e.g., duplicate email
   */
  static conflict(res, message = 'Resource already exists') {
    return this.error(res, message, 409);
  }

  /**
   * Validation Error (422)
   */
  static validationError(res, errors = []) {
    return this.error(res, 'Validation failed', 422, errors);
  }

  /**
   * Too Many Requests (429)
   */
  static tooManyRequests(res, message = 'Too many requests. Please try again later.') {
    return this.error(res, message, 429);
  }

  /**
   * Paginated response
   */
  static paginated(res, data, page, limit, total, message = 'Success') {
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ApiResponse;