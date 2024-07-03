import { NextFunction, Response, Request } from "express";
import { ApplicationError } from "../../core/utils/errors/applicationError";
import { HttpStatusCode } from "../../core/utils/httpStatusCode";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApplicationError) {
    const { message, name } = err;
    console.log(JSON.stringify(err));
    const statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    res.statusCode = statusCode;
    res.json({ name, message });
  } else {
    const name = "InternalServerError";
    const message = "An internal server error occurred";
    const statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    res.statusCode = statusCode;
    res.json({ name, message });
  }
  next();
}
