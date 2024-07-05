import request from 'supertest';
import { ExpressServer } from '../../../src/server';
import { normalisedMockTask, router as routerSucces } from '../../compositionRootMockSuccess';
import { router as routerFailure } from '../../compositionRootMockFailure';
import { HttpStatusCode } from '../../../src/core/utils/httpStatusCode';
import { BaseTask } from '../../../src/core/types/task.interface';
import bodyParser from 'body-parser';

describe('TasksController', () => {
  const baseTask: BaseTask = {
    title: normalisedMockTask.title,
    description: normalisedMockTask.description,
    completed: normalisedMockTask.completed,
  };

  describe('Succesfull requests', () => {
    const app = new ExpressServer({
      port: 3333,
    }).app;
    beforeAll(() => {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(routerSucces.getRoutes());
    });

    afterAll(() => {
      app.listen().close();
    });

    it('GET /api/tasks endpoint returns all tasks', async () => {
      const res = await request(app).get('/api/tasks');
      const { body, statusCode } = res;
      expect(body).toEqual([normalisedMockTask]);
      expect(statusCode).toEqual(200);
    });

    it('GET /api/tasks/:id endpoint returns requested task', async () => {
      const res = await request(app).get(`/api/tasks/${123456789}`);
      const { body, statusCode } = res;
      expect(body).toEqual(normalisedMockTask);
      expect(statusCode).toEqual(200);
    });

    it('POST /api/tasks/ endpoint creates a task', async () => {
      const res = await request(app).post(`/api/tasks`).send(baseTask).set('Accept', 'application/json');
      const { body, statusCode } = res;
      expect(body).toEqual(normalisedMockTask);
      expect(statusCode).toEqual(HttpStatusCode.CREATED);
    });

    it('PUT /api/tasks/ endpoint updates a task', async () => {
      const newTitle = 'new title';
      const updatedTask = { ...baseTask, title: newTitle };
      const res = await request(app)
        .put(`/api/tasks`)
        .send({ ...updatedTask, id: '123456789' })
        .set('Accept', 'application/json');
      const { body, statusCode } = res;
      expect(body).toEqual({ ...normalisedMockTask, ...updatedTask });
      expect(statusCode).toEqual(HttpStatusCode.OK);
    });

    it('DELETE /api/tasks/:id endpoint deletes a task', async () => {
      const res = await request(app).delete(`/api/tasks/${123456789}`).set('Accept', 'application/json');
      const { body, statusCode } = res;
      expect(body).toEqual([]);
      expect(statusCode).toEqual(HttpStatusCode.OK);
    });
  });

  describe('Failing requests', () => {
    const app = new ExpressServer({
      port: 3333,
    }).app;
    beforeAll(() => {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(routerFailure.getRoutes());
    });

    afterAll(() => {
      app.listen().close();
    });

    it('GET /api/tasks/ endpoint returns internal server error if processing error occures', async () => {
      const res = await request(app).get(`/api/tasks`);
      expect(res.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    });

    it('GET /api/tasks/:id endpoint returns not found if task is missing', async () => {
      const res = await request(app).get(`/api/tasks/${123456789}`);
      expect(res.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    });

    it('POST /api/tasks/ endpoint returns internal server error if processing error occures', async () => {
      const res = await request(app).post(`/api/tasks`).send(baseTask).set('Accept', 'application/json');
      expect(res.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    });

    it('PUT /api/tasks/ endpoint returns not found if task is missing', async () => {
      const res = await request(app)
        .put(`/api/tasks`)
        .send({ ...baseTask, id: '123456789' });
      expect(res.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    });

    it('DELETE /api/tasks/:id endpoint returns not found if task is missing', async () => {
      const res = await request(app).delete(`/api/tasks/${123456789}`);
      expect(res.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    });
  });
});
