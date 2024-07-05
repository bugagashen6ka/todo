import ITodoRepository from '../../../../src/domain/repositories/ITodoRepository';
import { TaskDto } from '../../../../src/domain/useCases/TaskDto';
import { expect } from '@jest/globals';
import { GetAllTasksUseCase } from '../../../../src/domain/useCases/tasks/GetAllTasksUseCase';

describe('GetAllTasksUseCase', () => {
  let getAllTasksUseCase: GetAllTasksUseCase;
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
    getAllTasksUseCase = new GetAllTasksUseCase(mockTodoRepository);
  });

  it('should create a new task and return the task DTO', async () => {
    mockTodoRepository.getTasks.mockResolvedValue([task]);

    const result = await getAllTasksUseCase.execute();

    expect(result).toBeDefined();
    expect(result).toEqual([task]);
  });
});
