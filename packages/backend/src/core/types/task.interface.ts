import { Document } from 'mongoose';
import { SubTask, SubTaskDocument } from './subtask.interface';

export interface BaseTask {
  title: string;
  description: string;
  completed: boolean;
}

export interface Task extends BaseTask {
  createdAt: Date;
  updatedAt: Date;
  subTasks: SubTask[];
}

export interface TaskDocument extends Document, Task {}
