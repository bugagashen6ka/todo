import SubTaskEntity from "../../entities/SubTaskEntity";
import ITodoRepository from "../../repositories/ITodoRepository";
import { SubTaskDto } from "../SubtTaskDto";

export class CreateSubTaskUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: string, subTask: SubTaskDto): Promise<SubTaskDto[] | null> {
    const subTasks = await this.todoRepository.createSubTask(id, subTask);
    return subTasks.map(
      (subTask) => new SubTaskEntity(subTask.title, subTask.id)
    );
  }
}
