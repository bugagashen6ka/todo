import { ApplicationError } from '../../../core/utils/errors/applicationError';
import ITodoRepository from '../../repositories/ITodoRepository';
import { TaskDto } from '../TaskDto';
import { toTaskDTO } from '../toTaskDto';

export class GetTaskUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<TaskDto> {
    try {
      const task = await this.todoRepository.getTask(id);
      if (!task) {
        throw ApplicationError.notFound(`Failed to get task with id ${id}.`);
      }
      return toTaskDTO(task);
    } catch {
      throw ApplicationError.badRequest(`Failed to get task with id ${id}.`);
    }
  }
}
