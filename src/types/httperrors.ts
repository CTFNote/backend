import { ErrorMessageParams } from ".";

export interface IHTTPError extends Error {
  statusCode?: number;
  details?: string;
  errorCode?: string;
}

export class HTTPError extends Error implements IHTTPError {
  statusCode: number;
  details?: string;
  errorCode?: string;
  constructor(HTTPErrorConfig?: ErrorMessageParams) {
    super(HTTPErrorConfig.message || "Internal Server Error");

    this.name = this.constructor.name;

    this.statusCode = HTTPErrorConfig.statusCode || 500;
    if (HTTPErrorConfig.details) this.details = HTTPErrorConfig.details;
    if (HTTPErrorConfig.errorCode) this.errorCode = HTTPErrorConfig.errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HTTPError {
  constructor({
    message = "Bad Request",
    statusCode = 400,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ message, statusCode, details, errorCode });
  }
}

export class UnauthorizedError extends HTTPError {
  constructor({
    message = "Unauthorized",
    statusCode = 401,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ message, statusCode, details, errorCode });
  }
}

export class ForbiddenError extends HTTPError {
  constructor({
    message = "Forbidden",
    statusCode = 403,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ message, statusCode, details, errorCode });
  }
}

export class NotFoundError extends HTTPError {
  constructor({
    message = "Not Found",
    statusCode = 404,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ message, statusCode, details, errorCode });
  }
}

export class MethodNotAllowedError extends HTTPError {
  constructor({
    message = "Method Not Allowed",
    statusCode = 405,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ message, statusCode, details, errorCode });
  }
}

export class ConflictError extends HTTPError {
  constructor({
    message = "Conflict",
    statusCode = 409,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ message, statusCode, details, errorCode });
  }
}

export class ImATeapotError extends HTTPError {
  constructor({
    message = "I'm a teapot",
    statusCode = 418,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ message, statusCode, details, errorCode });
  }
}

export class InternalServerError extends HTTPError {
  constructor({
    message = "Internal Server Error",
    statusCode = 500,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ message, statusCode, details, errorCode });
  }
}

export class NotImplementedError extends HTTPError {
  constructor({
    message = "Not Implemented",
    statusCode = 501,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ message, statusCode, details, errorCode });
  }
}
