import ITodoRepository from "../../repositories/ITodoRepository";
import { TaskDto } from "../TaskDto";
import { toTaskDTO } from "../toTaskDto";

export class GetTaskUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<TaskDto | null> {
    const task = await this.todoRepository.getTask(id);
    return task ? toTaskDTO(task) : null;
  }
}
