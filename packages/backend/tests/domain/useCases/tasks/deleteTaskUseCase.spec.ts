import ITodoRepository from '../../../../src/domain/repositories/ITodoRepository';
import { expect } from '@jest/globals';
import { ApplicationError } from '../../../../src/core/utils/errors/applicationError';
import { DeleteTaskUseCase } from '../../../../src/domain/useCases/tasks/DeleteTaskUseCase';

describe('DeleteTaskUseCase', () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
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
    deleteTaskUseCase = new DeleteTaskUseCase(mockTodoRepository);
  });

  it('should delete a task', async () => {
    mockTodoRepository.deleteTask.mockResolvedValue(task);

    const result = await deleteTaskUseCase.execute('id');

    expect(result).toBeDefined();
    expect(result).toEqual(task);
  });

  it('should throw application error if  task does not exist', async () => {
    mockTodoRepository.deleteTask.mockResolvedValue(null);

    await expect(deleteTaskUseCase.execute('unknown_id')).rejects.toThrow(ApplicationError);
  });

  it('should throw application error if finding the task failed', async () => {
    mockTodoRepository.deleteTask.mockRejectedValue(null);

    await expect(deleteTaskUseCase.execute('unknown_id')).rejects.toThrow(ApplicationError);
  });
});
