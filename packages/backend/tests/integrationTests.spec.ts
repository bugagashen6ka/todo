import request from 'supertest';
import { ExpressServer } from '../src/server';
import TaskModel from '../src/data/models/taskModel';
import { BaseTask, TaskDocument } from '../src/core/types/task.interface';
import { HttpStatusCode } from '../src/core/utils/httpStatusCode';
import { expect } from '@jest/globals';
import { SubTaskDto } from '../src/domain/useCases/SubtTaskDto';

describe('Integration Tests', () => {
  let id: string | null;
  const server = new ExpressServer({
    port: 3333,
  });
  const baseTask: BaseTask = {
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
  };

  const task = {
    ...baseTask,
    ...{
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subTasks: [],
    },
  };
  beforeAll(() => {
    server.start();
  });

  beforeEach(async () => {
    const createdTask: TaskDocument = new TaskModel(baseTask);
    await createdTask.save();
    id = createdTask.id;
  });

  afterAll(() => {
    server.close();
  });

  it('integration GET /api/tasks endpoint returns all tasks', async () => {
    const res = await request(server.app).get('/api/tasks');
    const { body, statusCode } = res;
    expect(body.length).toEqual(1);
    expect(body[0]).toEqual(
      expect.objectContaining({
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        subTasks: [],
        id,
      }),
    );
    expect(statusCode).toEqual(HttpStatusCode.OK);
  });

  it('integration GET /api/tasks/:id endpoint returns requested task', async () => {
    const res = await request(server.app).get(`/api/tasks/${id}`);
    const { body, statusCode } = res;
    expect(body).toEqual(
      expect.objectContaining({
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        subTasks: [],
        id,
      }),
    );
    expect(statusCode).toEqual(HttpStatusCode.OK);
  });

  it('integration POST /api/tasks/ endpoint creates a task', async () => {
    const newTask: BaseTask = {
      title: 'New Title',
      description: 'New description',
      completed: false,
    };
    const res = await request(server.app).post(`/api/tasks`).send(newTask);
    const { body, statusCode } = res;
    expect(body.id).toBeDefined();
    expect(body).toEqual(
      expect.objectContaining({
        title: newTask.title,
        description: newTask.description,
        completed: newTask.completed,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        subTasks: [],
        id: expect.not.stringMatching(id!),
      }),
    );
    expect(statusCode).toEqual(HttpStatusCode.CREATED);
    const tasks = await TaskModel.find();
    expect(tasks.length).toBe(2);
  });

  it('integration PUT /api/tasks/ endpoint updates a task', async () => {
    const newTitle = 'new title';
    const updatedTask = { ...baseTask, title: newTitle };
    const res = await request(server.app)
      .put(`/api/tasks`)
      .send({ ...updatedTask, id });
    const { body, statusCode } = res;
    expect(body.id).toBe(id);
    expect(body).toEqual(
      expect.objectContaining({
        title: newTitle,
        description: task.description,
        completed: task.completed,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        subTasks: [],
        id,
      }),
    );
    expect(statusCode).toEqual(HttpStatusCode.OK);
  });

  it('DELETE /api/tasks/:id endpoint deletes a task', async () => {
    const res = await request(server.app).delete(`/api/tasks/${id}`);
    const { body, statusCode } = res;
    expect(body).toEqual(
      expect.objectContaining({
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        subTasks: [],
        id,
      }),
    );
    expect(statusCode).toEqual(HttpStatusCode.OK);
  });

  it('PATCH /api/tasks/subtask endpoint creates a subtask', async () => {
    const subTask = { subTask: { title: 'SubTask Title' } };
    const res = await request(server.app)
      .patch(`/api/tasks/subtask`)
      .send({ id, ...subTask });

    const { body, statusCode } = res;
    expect(body[0]).toEqual(
      expect.objectContaining({
        title: subTask.subTask.title,
        id: expect.any(String),
      }),
    );
    expect(statusCode).toEqual(HttpStatusCode.CREATED);
  });

  it('DELETE /api/tasks/:id/subtask/:subtaskid endpoint deletes a subtask', async () => {
    const task = await TaskModel.findById(id);
    task!.subTasks.push({ title: 'New Subtask' });
    await task!.save();
    const subTask = task?.subTasks[0];
    const subTaskId = (subTask as SubTaskDto).id;

    const res = await request(server.app)
      .delete(`/api/tasks/${id}/subtask/${subTaskId}`)
      .set('Accept', 'application/json');
    const { body, statusCode } = res;
    expect(body).toEqual({ deleted: true });
    expect(statusCode).toEqual(HttpStatusCode.OK);
  });

  it('throws not-found error for non-existing path', async () => {
    const res = await request(server.app).put(`/api/tasks/non-existing`);
    expect(res.statusCode).toBe(HttpStatusCode.NOT_FOUND);
  });
});
