export interface IHTTPError extends Error {
  statusCode: number;
}

export class HTTPError extends Error implements IHTTPError {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HTTPError {
  constructor(message = "Bad Request", statusCode = 400) {
    super(message, statusCode);
  }
}

export class NotFoundError extends HTTPError {
  constructor(message = "Not Found", statusCode = 404) {
    super(message, statusCode);
  }
}

export class MethodNotAllowedError extends HTTPError {
  constructor(message = "Method Not Allowed", statusCode = 405) {
    super(message, statusCode);
  }
}

export class ImATeapotError extends HTTPError {
  constructor(message = "I'm A Teapot", statuscode = 418) {
    super(message, statuscode);
  }
}

export class InternalServerError extends HTTPError {
  constructor(message = "Internal Server Error", statuscode = 500) {
    super(message, statuscode);
  }
}

export class NotImplementedError extends HTTPError {
  constructor(message = "Not Implemented", statuscode = 501) {
    super(message, statuscode);
  }
}
