import SubTaskEntity from '../entities/SubTaskEntity';
import TaskEntity from '../entities/TaskEntity';

export default interface ITodoRepository {
  getTasks(): Promise<TaskEntity[]>;
  getTask(id: string): Promise<TaskEntity | null>;
  createTask(title: string, description: string, completed: boolean): Promise<TaskEntity>;
  updateTask(id: string, title: string, description: string, completed: boolean): Promise<TaskEntity | null>;
  deleteTask(id: string): Promise<TaskEntity | null>;

  createSubTask(id: string, subTask: SubTaskEntity): Promise<SubTaskEntity[]>;
  deleteSubTask(subTaskId: string): Promise<{ deleted: boolean }>;
}
