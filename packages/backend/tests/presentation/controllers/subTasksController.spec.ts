import request from 'supertest';
import { ExpressServer } from '../../../src/server';
import { mockSubTask, normalisedMockTask, router as routerSucces } from '../../compositionRootMockSuccess';
import { router as routerFailure } from '../../compositionRootMockFailure';
import { HttpStatusCode } from '../../../src/core/utils/httpStatusCode';
import { BaseTask } from '../../../src/core/types/task.interface';
import bodyParser from 'body-parser';
import { title } from 'process';

describe('SubTasksController', () => {
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

    it('PATCH /api/tasks/subtask endpoint creates a subtask', async () => {
      const res = await request(app).patch('/api/tasks/subtask');
      const { body, statusCode } = res;
      expect(body).toEqual([mockSubTask]);
      expect(statusCode).toEqual(HttpStatusCode.CREATED);
    });

    it('DELETE /api/tasks/:id/subtask/:subtaskid endpoint deletes a subtask', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${123456789}/subtask/${987654321}`)
        .set('Accept', 'application/json');
      const { body, statusCode } = res;
      expect(body).toEqual({ deleted: true });
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

    it('PATCH /api/tasks/subtask endpoint returns not found if task is missing', async () => {
      const res = await request(app).patch(`/api/tasks/subtask`);
      expect(res.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    });

    it('DELETE /api/tasks/:id/subtask/:subtaskid endpoint returns not found if subtask is missing', async () => {
      const res = await request(app).delete(`/api/tasks/${123456789}/subtask/${987654321}`);
      expect(res.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    });
  });
});
