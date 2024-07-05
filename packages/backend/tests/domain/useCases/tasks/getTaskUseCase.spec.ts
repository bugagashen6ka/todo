import ITodoRepository from '../../../../src/domain/repositories/ITodoRepository';
import { expect } from '@jest/globals';
import { GetTaskUseCase } from '../../../../src/domain/useCases/tasks/GetTaskUseCase';
import { ApplicationError } from '../../../../src/core/utils/errors/applicationError';

describe('GetTaskUseCase', () => {
  let getTaskUseCase: GetTaskUseCase;
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
    getTaskUseCase = new GetTaskUseCase(mockTodoRepository);
  });

  it('should create a new task and return the task DTO', async () => {
    mockTodoRepository.getTask.mockResolvedValue(task);

    const result = await getTaskUseCase.execute('id');

    expect(result).toBeDefined();
    expect(result).toEqual(task);
  });

  it('should throw application error if  task does not exist', async () => {
    mockTodoRepository.getTask.mockResolvedValue(null);

    await expect(getTaskUseCase.execute('unknown_id')).rejects.toThrow(ApplicationError);
  });

  it('should throw application error if finding the task failed', async () => {
    mockTodoRepository.getTask.mockRejectedValue(null);

    await expect(getTaskUseCase.execute('unknown_id')).rejects.toThrow(ApplicationError);
  });
});
