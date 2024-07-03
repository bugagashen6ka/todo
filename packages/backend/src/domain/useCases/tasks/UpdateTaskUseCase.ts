import ITodoRepository from "../../repositories/ITodoRepository";
import { TaskDto } from "../TaskDto";
import { toTaskDTO } from "../toTaskDto";

export class UpdateTaskUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(
    id: string,
    title: string,
    description: string,
    completed: boolean
  ): Promise<TaskDto | null> {
    const task = await this.todoRepository.updateTask(
      id,
      title,
      description,
      completed
    );
    return task ? toTaskDTO(task) : null;
  }
}
