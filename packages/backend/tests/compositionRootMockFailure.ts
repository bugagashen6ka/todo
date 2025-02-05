import { TaskDto } from '../src/domain/useCases/TaskDto';
import { CreateSubTaskUseCase } from '../src/domain/useCases/subTasks/CreateSubTaskUseCase';
import { DeleteSubTaskUseCase } from '../src/domain/useCases/subTasks/DeleteSubTaskUseCase';
import { CreateTaskUseCase } from '../src/domain/useCases/tasks/CreateTaskUseCase';
import { DeleteTaskUseCase } from '../src/domain/useCases/tasks/DeleteTaskUseCase';
import { GetAllTasksUseCase } from '../src/domain/useCases/tasks/GetAllTasksUseCase';
import { GetTaskUseCase } from '../src/domain/useCases/tasks/GetTaskUseCase';
import { UpdateTaskUseCase } from '../src/domain/useCases/tasks/UpdateTaskUseCase';
import { SubTasksController } from '../src/presentation/controllers/subTasksController';
import { TasksController } from '../src/presentation/controllers/tasksController';
import { TodoRouter } from '../src/presentation/routes/todo-router';

const autoGeneratedTime = new Date();
export const mockTask = {
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  createdAt: autoGeneratedTime,
  updatedAt: autoGeneratedTime,
  subTasks: [],
};

export const normalisedMockTask = {
  ...mockTask,
  ...{
    createdAt: autoGeneratedTime.toISOString(),
    updatedAt: autoGeneratedTime.toISOString(),
  },
};

export class GetAllTasksUseCaseMock {
  async execute(): Promise<TaskDto[]> {
    throw new Error();
  }
}

export class GetTaskUseCaseMock {
  async execute(): Promise<TaskDto> {
    return {} as any;
  }
}

export class CreateTaskUseCaseMock {
  async execute(): Promise<TaskDto[]> {
    throw new Error();
  }
}

export class UpdateTaskUseCaseMock {
  async execute(): Promise<TaskDto | null> {
    return null as any;
  }
}

export class DeleteTaskUseCaseMock {
  async execute(): Promise<TaskDto | null> {
    return null;
  }
}

export class CreateSubTaskUseCaseMock {
  async execute(): Promise<TaskDto | null> {
    return null;
  }
}

export class DeleteSubTaskUseCaseMock {
  async execute(): Promise<{ deleted: boolean }> {
    return { deleted: false };
  }
}

const tasksController = new TasksController(
  new GetAllTasksUseCaseMock() as GetAllTasksUseCase,
  new GetTaskUseCaseMock() as unknown as GetTaskUseCase,
  new CreateTaskUseCaseMock() as unknown as CreateTaskUseCase,
  new UpdateTaskUseCaseMock() as unknown as UpdateTaskUseCase,
  new DeleteTaskUseCaseMock() as unknown as DeleteTaskUseCase,
);
const subTasksController = new SubTasksController(
  new CreateSubTaskUseCaseMock() as unknown as CreateSubTaskUseCase,
  new DeleteSubTaskUseCaseMock() as unknown as DeleteSubTaskUseCase,
);

export const router = new TodoRouter(tasksController, subTasksController);
