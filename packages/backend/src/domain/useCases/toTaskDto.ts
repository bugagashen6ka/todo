import TaskEntity from '../entities/TaskEntity';
import { TaskDto } from './TaskDto';

export function toTaskDTO(task: TaskEntity): TaskDto {
  return new TaskDto(
    task.title,
    task.description,
    task.completed,
    task.createdAt,
    task.updatedAt,
    task.subTasks,
    task.id,
  );
}
