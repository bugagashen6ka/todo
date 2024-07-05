import { ApplicationError } from '../../../../src/core/utils/errors/applicationError';
import { HttpStatusCode } from '../../../../src/core/utils/httpStatusCode';

describe('ApplicationError', () => {
  describe('constructor', () => {
    it('should create an instance of ApplicationError', () => {
      const error = new ApplicationError('TestError', 'Test message', HttpStatusCode.INTERNAL_SERVER_ERROR);

      expect(error instanceof ApplicationError).toBeTruthy();
      expect(error.name).toBe('TestError');
      expect(error.message).toBe('Test message');
      expect(error.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
    });
  });

  describe('notFound', () => {
    it('should create a NotFoundError instance', () => {
      const message = 'Resource not found';
      const error = ApplicationError.notFound(message);

      expect(error instanceof ApplicationError).toBeTruthy();
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(HttpStatusCode.NOT_FOUND);
    });
  });

  describe('badRequest', () => {
    it('should create a BadRequestError instance', () => {
      const message = 'Invalid input';
      const error = ApplicationError.badRequest(message);

      expect(error instanceof ApplicationError).toBeTruthy();
      expect(error.name).toBe('BadRequestError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    });
  });
});
