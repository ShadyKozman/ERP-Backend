export const sendSuccess = (res, data, message, statusCode) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message, statusCode) => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

export const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return sendError(res, err.message, err.statusCode);
  }

  console.error("💥 UNEXPECTED ERROR: ", err);
  sendError(res, "Something went wrong on the server", 500);

  setImmediate(() => process.exit(1));
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}
