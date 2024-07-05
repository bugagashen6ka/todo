import ITodoRepository from '../../../../src/domain/repositories/ITodoRepository';
import { expect } from '@jest/globals';
import { ApplicationError } from '../../../../src/core/utils/errors/applicationError';
import { DeleteTaskUseCase } from '../../../../src/domain/useCases/tasks/DeleteTaskUseCase';
import { UpdateTaskUseCase } from '../../../../src/domain/useCases/tasks/UpdateTaskUseCase';

describe('UpdateTaskUseCase', () => {
  let updateTaskUseCase: UpdateTaskUseCase;
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
    updateTaskUseCase = new UpdateTaskUseCase(mockTodoRepository);
  });

  it('should update a task', async () => {
    mockTodoRepository.updateTask.mockResolvedValue(task);

    const result = await updateTaskUseCase.execute('id', task.title, task.description, task.completed);

    expect(result).toBeDefined();
    expect(result).toEqual(task);
  });

  it('should throw application error if  task does not exist', async () => {
    mockTodoRepository.updateTask.mockResolvedValue(null);

    await expect(updateTaskUseCase.execute('unknown_id', task.title, task.description, task.completed)).rejects.toThrow(
      ApplicationError,
    );
  });

  it('should throw application error if finding the task failed', async () => {
    mockTodoRepository.updateTask.mockRejectedValue(null);

    await expect(updateTaskUseCase.execute('unknown_id', task.title, task.description, task.completed)).rejects.toThrow(
      ApplicationError,
    );
  });
});
