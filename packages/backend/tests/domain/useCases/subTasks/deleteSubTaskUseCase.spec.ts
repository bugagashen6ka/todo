import ITodoRepository from '../../../../src/domain/repositories/ITodoRepository';
import { DeleteSubTaskUseCase } from '../../../../src/domain/useCases/subTasks/DeleteSubTaskUseCase';
import { expect } from '@jest/globals';

describe('DeleteSubTaskUseCase', () => {
  let deleteSubTaskUseCase: DeleteSubTaskUseCase;
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
    deleteSubTaskUseCase = new DeleteSubTaskUseCase(mockTodoRepository);
  });

  it('should create a new task and return the task DTO', async () => {
    mockTodoRepository.deleteSubTask.mockResolvedValue({ deleted: true });

    const result = await deleteSubTaskUseCase.execute('id');

    expect(result).toBeDefined();
    expect(result).toEqual({ deleted: true });
  });
});
