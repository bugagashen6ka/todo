import { ApplicationError } from '../../../core/utils/errors/applicationError';
import ITodoRepository from '../../repositories/ITodoRepository';
import { TaskDto } from '../TaskDto';
import { toTaskDTO } from '../toTaskDto';

export class DeleteTaskUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<TaskDto> {
    try {
      const task = await this.todoRepository.deleteTask(id);
      if (!task) {
        throw ApplicationError.notFound(`Failed to delete task with id ${id}.`);
      }
      return toTaskDTO(task);
    } catch {
      throw ApplicationError.badRequest(`Failed to delete task with id ${id}.`);
    }
  }
}
