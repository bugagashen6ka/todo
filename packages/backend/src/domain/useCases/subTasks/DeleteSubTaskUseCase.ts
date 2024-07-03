import ITodoRepository from '../../repositories/ITodoRepository';

export class DeleteSubTaskUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(subTaskId: string): Promise<{ deleted: boolean }> {
    return await this.todoRepository.deleteSubTask(subTaskId);
  }
}
