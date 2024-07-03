import TaskEntity from "../../entities/TaskEntity";
import ITodoRepository from "../../repositories/ITodoRepository";
import { TaskDto } from "../TaskDto";
import { toTaskDTO } from "../toTaskDto";

export class GetAllTasksUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(): Promise<TaskDto[]> {
    const tasks = await this.todoRepository.getTasks();
    return tasks.map(toTaskDTO);
  }
}
