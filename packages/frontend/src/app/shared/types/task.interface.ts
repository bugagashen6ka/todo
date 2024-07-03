import { SubTaskInterface } from './subTask.interface';

export interface TaskInterface extends SubTaskInterface {
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  subTasks: SubTaskInterface[];
}
