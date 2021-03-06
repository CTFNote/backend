import { ErrorMessageParams } from ".";

export interface IHTTPError extends Error {
  statusCode?: number;
  details?: string;
  errorCode?: string;
  errorMessage?: string;
}

export class HTTPError extends Error implements IHTTPError {
  statusCode: number;
  details?: string;
  errorCode?: string;
  errorMessage?: string;
  constructor(HTTPErrorConfig?: ErrorMessageParams) {
    super(HTTPErrorConfig.errorMessage || "Internal Server Error");

    this.name = this.constructor.name;
    this.errorMessage = HTTPErrorConfig.errorMessage || "Internal Server Error";
    this.statusCode = HTTPErrorConfig.statusCode || 500;
    if (HTTPErrorConfig.details) this.details = HTTPErrorConfig.details;
    if (HTTPErrorConfig.errorCode) this.errorCode = HTTPErrorConfig.errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HTTPError {
  constructor({
    errorMessage = "Bad Request",
    statusCode = 400,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ errorMessage, statusCode, details, errorCode });
  }
}

export class UnauthorizedError extends HTTPError {
  constructor({
    errorMessage = "Unauthorized",
    statusCode = 401,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ errorMessage, statusCode, details, errorCode });
  }
}

export class ForbiddenError extends HTTPError {
  constructor({
    errorMessage = "Forbidden",
    statusCode = 403,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ errorMessage, statusCode, details, errorCode });
  }
}

export class NotFoundError extends HTTPError {
  constructor({
    errorMessage = "Not Found",
    statusCode = 404,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ errorMessage, statusCode, details, errorCode });
  }
}

export class MethodNotAllowedError extends HTTPError {
  constructor({
    errorMessage = "Method Not Allowed",
    statusCode = 405,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ errorMessage, statusCode, details, errorCode });
  }
}

export class ConflictError extends HTTPError {
  constructor({
    errorMessage = "Conflict",
    statusCode = 409,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ errorMessage, statusCode, details, errorCode });
  }
}

export class ImATeapotError extends HTTPError {
  constructor({
    errorMessage = "I'm a teapot",
    statusCode = 418,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ errorMessage, statusCode, details, errorCode });
  }
}

export class InternalServerError extends HTTPError {
  constructor({
    errorMessage = "Internal Server Error",
    statusCode = 500,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ errorMessage, statusCode, details, errorCode });
  }
}

export class NotImplementedError extends HTTPError {
  constructor({
    errorMessage = "Not Implemented",
    statusCode = 501,
    details = undefined,
    errorCode = undefined,
  }: ErrorMessageParams = {}) {
    super({ errorMessage, statusCode, details, errorCode });
  }
}
