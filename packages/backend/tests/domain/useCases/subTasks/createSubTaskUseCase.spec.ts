import ITodoRepository from '../../../../src/domain/repositories/ITodoRepository';
import { CreateSubTaskUseCase } from '../../../../src/domain/useCases/subTasks/CreateSubTaskUseCase';
import { expect } from '@jest/globals';

describe('CreateSubTaskUseCase', () => {
  let createSubTaskUseCase: CreateSubTaskUseCase;
  let mockTodoRepository: jest.Mocked<ITodoRepository>;
  const subTask = {
    title: 'Test SubTask',
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
    createSubTaskUseCase = new CreateSubTaskUseCase(mockTodoRepository);
  });

  it('should create a new task and return the task DTO', async () => {
    const createdSubTask = { id: 'id', title: subTask.title };
    mockTodoRepository.createSubTask.mockResolvedValue([createdSubTask]);

    const result = await createSubTaskUseCase.execute('id', subTask);

    expect(result).toBeDefined();
    expect(result).toEqual([createdSubTask]);
  });
});
