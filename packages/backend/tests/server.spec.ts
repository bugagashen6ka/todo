import { ExpressServer } from '../src/server';
import { expect } from '@jest/globals';
import http from 'http';

jest.mock('express', () => {
  const app = {
    all: jest.fn((uri, callback) => {
      const mockReq = { originalUrl: '/nonexistent-route' };
      const mockRes = {};
      const mockNext = jest.fn();
      callback(mockReq, mockRes, mockNext);
    }),
    use: jest.fn(),
    address: jest.fn(),
    listen: jest.fn((port, callback) => callback()),
  };
  return jest.fn(() => app);
});

jest.mock('body-parser', () => ({
  json: jest.fn(),
  urlencoded: jest.fn(),
}));

jest.mock('../src/compositionRoot', () => ({
  get router() {
    return {
      getRoutes: jest.fn().mockReturnValue('getRoutes'),
    };
  },
}));

jest.mock('cors');

/*
jest.mock('http', () => {
  const httpServer = {
    close: jest.fn(),
    listen: jest.fn((port, callback) => callback()),
  };
  return jest.fn(() => httpServer);
});
*/

describe('Server', () => {
  let server: ExpressServer;

  beforeAll(async () => {
    server = new ExpressServer({ port: 3333 });
  });

  afterEach(() => {
    server.close();
  });

  it('adds all middleware functions', async () => {
    await server.start();
    expect(server.app.use).toHaveBeenCalledTimes(5);
  });

  it('adds routes ', async () => {
    await server.start();
    expect(server.app.use).toHaveBeenCalledWith('getRoutes');
  });

  it('should register handling route that does not exist', async () => {
    await server.start();
    server.app.all('*', () => {});
  });
});
