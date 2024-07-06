import { TestBed } from '@angular/core/testing';
import { TasksService } from './tasks.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskInterface } from '../types/task.interface';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

describe('TasksService', () => {
  let tasksService: TasksService;
  let httpTestingController: HttpTestingController;
  const dummyTask: TaskInterface = {
    id: '123',
    title: 'Work Hard',
    description: 'Eat Sleep Compute',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subTasks: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksService],
    });

    tasksService = TestBed.inject(TasksService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('creates service', () => {
    expect(tasksService).toBeTruthy;
  });

  describe('getTasks', () => {
    it('should return a list of tasks', () => {
      tasksService.getTasks();
      const req = httpTestingController.expectOne(environment.apiUrl + '/tasks');
      req.flush([dummyTask]);
      expect(tasksService.tasks$.getValue()).toEqual([dummyTask]);
    });

    it('calls the correct http method', () => {
      let task: TaskInterface = {
        id: '123',
        title: 'Work Hard',
        description: 'Eat Sleep Compute',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
      };
      tasksService.getTasks();
      const req = httpTestingController.expectOne(environment.apiUrl + '/tasks');
      req.flush([task]);
      expect(req.request.method).toEqual('GET');
    });
  });
  describe('createTask', () => {
    it('should return a new task', () => {
      tasksService.createTask(dummyTask.title, dummyTask.description, dummyTask.completed);
      const req = httpTestingController.expectOne(environment.apiUrl + '/tasks');
      req.flush(dummyTask);
      expect(tasksService.tasks$.getValue()).toEqual([dummyTask]);
    });

    it('calls the correct http method', () => {
      tasksService.createTask(dummyTask.title, dummyTask.description, dummyTask.completed);
      const req = httpTestingController.expectOne(environment.apiUrl + '/tasks');
      req.flush([dummyTask]);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('updateTask', () => {
    it('should return updated task', () => {
      tasksService.tasks$.next([dummyTask]);
      const newTitle = 'newDummyTitle';
      tasksService.updateTask(dummyTask.id, newTitle, dummyTask.description, dummyTask.completed);

      const req = httpTestingController.expectOne(environment.apiUrl + '/tasks');
      const newUpdatedTask = { ...dummyTask, title: newTitle };
      req.flush(newUpdatedTask);
      expect(tasksService.tasks$.getValue()).toEqual([newUpdatedTask]);
    });

    it('calls the correct http method', () => {
      tasksService.tasks$.next([dummyTask]);
      const newTitle = 'newDummyTitle';
      tasksService.updateTask(dummyTask.id, newTitle, dummyTask.description, dummyTask.completed);
      const req = httpTestingController.expectOne(environment.apiUrl + '/tasks');
      req.flush([dummyTask]);
      expect(req.request.method).toEqual('PUT');
    });
  });

  describe('deleteTask', () => {
    it('should delete specified todo task', () => {
      tasksService.tasks$.next([dummyTask]);
      tasksService.deleteTask(dummyTask.id);
      const req = httpTestingController.expectOne(environment.apiUrl + `/tasks/${dummyTask.id}`);
      req.flush([dummyTask]);
      expect(tasksService.tasks$.getValue()).toEqual([]);
    });

    it('calls the correct http method', () => {
      tasksService.deleteTask(dummyTask.id);
      const req = httpTestingController.expectOne(environment.apiUrl + `/tasks/${dummyTask.id}`);
      req.flush([dummyTask]);
      expect(req.request.method).toEqual('DELETE');
    });
  });
});
