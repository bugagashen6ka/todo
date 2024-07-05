import { NextFunction, Response, Request } from 'express';
import { ApplicationError } from '../../core/utils/errors/applicationError';
import { HttpStatusCode } from '../../core/utils/httpStatusCode';
import { Error } from 'mongoose';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApplicationError) {
    const { message, name } = err;
    const statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    res.statusCode = statusCode;
    res.json({ name, message });
  } else if (err instanceof Error.ValidationError) {
    const messages = Object.values(err.errors).map((err) => err.message);
    const statusCode = HttpStatusCode.UNPROCESSABLE_CONTENT;
    res.statusCode = statusCode;
    res.json({ name: 'BadRequest', messages });
  } else {
    const name = 'InternalServerError';
    const message = 'An internal server error occurred';
    const statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    res.statusCode = statusCode;
    res.json({ name, message });
  }
  next();
}
