import ITodoRepository from '../../repositories/ITodoRepository';
import { TaskDto } from '../TaskDto';
import { toTaskDTO } from '../toTaskDto';

export class CreateTaskUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(title: string, description: string, completed: boolean): Promise<TaskDto | null> {
    const task = await this.todoRepository.createTask(title, description, completed);
    return task ? toTaskDTO(task) : null;
  }
}
