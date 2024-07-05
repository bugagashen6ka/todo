import { NextFunction, Response, Request } from 'express';
import { Error } from 'mongoose';
import { errorHandler } from '../../../src/presentation/middlewares/errorHandler';
import { ApplicationError } from '../../../src/core/utils/errors/applicationError';
import { HttpStatusCode } from '../../../src/core/utils/httpStatusCode';

describe('ErrorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });
  it('handles application errors', () => {
    const errorMessage = 'Requested resource not found.';
    const err = ApplicationError.notFound(errorMessage);
    errorHandler(err, mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage, name: 'NotFoundError' });
  });

  it('handles application errors without provided status scode', () => {
    const errorMessage = 'Requested resource not found.';
    const err = ApplicationError.notFound(errorMessage);
    err.statusCode = null as any;
    errorHandler(err, mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);

    expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage, name: 'NotFoundError' });
  });

  it('handles Mongoose validation errors', () => {
    const errorMessage = 'Requested resource not valid.';
    const castError = new Error.CastError('validation', errorMessage, 'somepath');
    const err = new Error.ValidationError();
    err.errors = { path: castError };
    errorHandler(err, mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toHaveBeenCalledWith({
      messages: [`Cast to validation failed for value \"${errorMessage}\" (type string) at path \"somepath\"`],
      name: 'BadRequest',
    });
  });

  it('handles any errors', () => {
    const err = new Error('Internal processing error.');
    errorHandler(err, mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'An internal server error occurred',
      name: 'InternalServerError',
    });
  });
});
