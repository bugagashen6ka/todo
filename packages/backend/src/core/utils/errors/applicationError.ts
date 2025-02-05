import { HttpStatusCode } from '../httpStatusCode';

export class ApplicationError extends Error {
  private readonly isOperational = true;

  constructor(
    public name: string,
    public message: string,
    public statusCode: HttpStatusCode,
  ) {
    super(message);
  }

  static notFound(message: string): ApplicationError {
    return new ApplicationError('NotFoundError', message, HttpStatusCode.NOT_FOUND);
  }

  static badRequest(message: string): ApplicationError {
    return new ApplicationError('BadRequestError', message, HttpStatusCode.BAD_REQUEST);
  }
}
