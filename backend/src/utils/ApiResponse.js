const { HTTP_STATUS, MESSAGES } = require('../config/constants');

class ApiResponse {
  constructor(data = null, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK, meta = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date().toISOString();
    
    if (data !== null) {
      this.data = data;
    }
    
    if (meta) {
      this.meta = meta;
    }
  }

  // Static factory methods for common responses
  static success(data = null, message = MESSAGES.SUCCESS) {
    return new ApiResponse(data, message, HTTP_STATUS.OK);
  }

  static created(data = null, message = MESSAGES.CREATED) {
    return new ApiResponse(data, message, HTTP_STATUS.CREATED);
  }

  static noContent(message = 'No Content') {
    return new ApiResponse(null, message, HTTP_STATUS.NO_CONTENT);
  }

  // Paginated response
  static paginated(data, pagination, message = MESSAGES.SUCCESS) {
    const meta = {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1
      }
    };
    
    return new ApiResponse(data, message, HTTP_STATUS.OK, meta);
  }

  // List response with count
  static list(data, count = null, message = MESSAGES.SUCCESS) {
    const meta = count !== null ? { count } : null;
    return new ApiResponse(data, message, HTTP_STATUS.OK, meta);
  }

  // Send response using Express res object
  send(res) {
    return res.status(this.statusCode).json(this);
  }

  // Convert to JSON
  toJSON() {
    const response = {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      timestamp: this.timestamp
    };

    if (this.data !== undefined) {
      response.data = this.data;
    }

    if (this.meta) {
      response.meta = this.meta;
    }

    return response;
  }
}

module.exports = ApiResponse;