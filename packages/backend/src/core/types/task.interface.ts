import { Document } from 'mongoose';
import { SubTask, SubTaskDocument } from './subtask.interface';

export interface Task {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  subTasks: SubTask[];
}

export interface TaskDocument extends Document, Task {}
