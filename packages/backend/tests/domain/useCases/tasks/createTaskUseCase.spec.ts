import { ApplicationError } from '../../../../src/core/utils/errors/applicationError';
import ITodoRepository from '../../../../src/domain/repositories/ITodoRepository';
import { TaskDto } from '../../../../src/domain/useCases/TaskDto';
import { CreateTaskUseCase } from '../../../../src/domain/useCases/tasks/CreateTaskUseCase';
import { expect } from '@jest/globals';

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;
  let mockTodoRepository: jest.Mocked<ITodoRepository>;
  const task = {
    title: 'Test Task',
    description: 'This is a test task',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    subTasks: [],
  };

  beforeEach(() => {
    mockTodoRepository = {
      getTasks: jest.fn(),
      getTask: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      createSubTask: jest.fn(),
      deleteSubTask: jest.fn(),
    };
    createTaskUseCase = new CreateTaskUseCase(mockTodoRepository);
  });

  it('should create a new task and return the task DTO', async () => {
    mockTodoRepository.createTask.mockResolvedValue(task);

    const result = await createTaskUseCase.execute(task.title, task.description, task.completed);

    expect(result).toBeDefined();
    expect(result as TaskDto).toEqual(task);
    expect(mockTodoRepository.createTask).toHaveBeenCalledWith(task.title, task.description, task.completed);
  });

  it('should throw BadRequest error if task creation failed', async () => {
    mockTodoRepository.createTask.mockRejectedValue(null);

    await expect(createTaskUseCase.execute(task.title, task.description, task.completed)).rejects.toThrow(
      ApplicationError,
    );
  });
});
