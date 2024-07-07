import { TestBed } from '@angular/core/testing';
import { TasksService } from './tasks.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskInterface } from '../types/task.interface';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { SubTasksService } from './subTasks.service';
import { SubTaskInterface } from '../types/subTask.interface';
import { BehaviorSubject } from 'rxjs';

describe('SubTasksService', () => {
  let subTasksService: SubTasksService;

  let httpTestingController: HttpTestingController;
  const dummySubTask: SubTaskInterface = {
    id: '555',
    title: 'do it well',
  };
  const dummyTask: TaskInterface = {
    id: '123',
    title: 'Work Hard',
    description: 'Eat Sleep Compute',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subTasks: [],
  };
  const dummyTask2: TaskInterface = {
    id: '456',
    title: 'Work Hard 2',
    description: 'Eat Sleep Compute 2',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subTasks: [],
  };
  const tasksServiceMock = {
    tasks$: new BehaviorSubject<TaskInterface[]>([]),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SubTasksService,
        {
          provide: TasksService,
          useValue: tasksServiceMock,
        },
      ],
    });

    subTasksService = TestBed.inject(SubTasksService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    dummyTask.subTasks = [];
  });

  it('creates service', () => {
    expect(subTasksService).toBeTruthy;
  });

  describe('createSubTask', () => {
    it('should add new subTask under existing task', () => {
      subTasksService.tasksService.tasks$.next([dummyTask, dummyTask2]);
      subTasksService.createSubTask(dummyTask.id, dummySubTask.title);
      const req = httpTestingController.expectOne(environment.apiUrl + `/tasks/${dummyTask.id}/subtask`);
      const dummyTaskWithUpdatedSubTask = {
        ...dummyTask,
        subTasks: [dummySubTask],
      };
      req.flush([dummySubTask]);
      expect(subTasksService.tasksService.tasks$.getValue()).toEqual([dummyTaskWithUpdatedSubTask, dummyTask2]);
    });

    it('should delete subTask from existing task', () => {
      subTasksService.tasksService.tasks$.next([
        {
          ...dummyTask,
          subTasks: [dummySubTask],
        },
      ]);
      subTasksService.deleteSubTask(dummyTask.id, dummySubTask.id);
      const req = httpTestingController.expectOne(
        environment.apiUrl + `/tasks/${dummyTask.id}/subtask/${dummySubTask.id}`,
      );
      req.flush({ modifiedCount: 1 });
      expect(subTasksService.tasksService.tasks$.getValue()).toEqual([dummyTask]);
    });
  });
});
