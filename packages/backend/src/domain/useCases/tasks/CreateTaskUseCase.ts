import { ApplicationError } from '../../../core/utils/errors/applicationError';
import ITodoRepository from '../../repositories/ITodoRepository';
import { TaskDto } from '../TaskDto';
import { toTaskDTO } from '../toTaskDto';

export class CreateTaskUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(title: string, description: string, completed: boolean): Promise<TaskDto> {
    try {
      const task = await this.todoRepository.createTask(title, description, completed);
      return toTaskDTO(task);
    } catch {
      throw ApplicationError.badRequest(`Failed to create task.`);
    }
  }
}
