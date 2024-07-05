import { ApplicationError } from '../../../core/utils/errors/applicationError';
import ITodoRepository from '../../repositories/ITodoRepository';
import { TaskDto } from '../TaskDto';
import { toTaskDTO } from '../toTaskDto';

export class UpdateTaskUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: string, title: string, description: string, completed: boolean): Promise<TaskDto> {
    try {
      const task = await this.todoRepository.updateTask(id, title, description, completed);
      if (!task) {
        throw ApplicationError.notFound(`Failed to update task with id ${id}.`);
      }
      return toTaskDTO(task);
    } catch {
      throw ApplicationError.badRequest(`Failed to update task with id ${id}.`);
    }
  }
}
