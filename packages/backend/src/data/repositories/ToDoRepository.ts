import mongoose from 'mongoose';
import { ApplicationError } from '../../core/utils/errors/applicationError';
import SubTaskEntity from '../../domain/entities/SubTaskEntity';
import TaskEntity from '../../domain/entities/TaskEntity';
import ITodoRepository from '../../domain/repositories/ITodoRepository';
import TaskModel from '../models/taskModel';
import { SubTaskDocument } from '../../core/types/subtask.interface';

export default class ToDoRepository implements ITodoRepository {
  getTasks(): Promise<TaskEntity[]> {
    return TaskModel.find();
  }

  getTask(id: string): Promise<TaskEntity | null> {
    return TaskModel.findById(id);
  }

  createTask(title: string, description: string, completed: boolean): Promise<TaskEntity> {
    const newTask = new TaskModel({
      title,
      description,
      completed,
    });
    return newTask.save();
  }

  updateTask(id: string, title: string, description: string, completed: boolean): Promise<TaskEntity | null> {
    return TaskModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        completed,
      },
      { new: true },
    );
  }
  deleteTask(id: string): Promise<TaskEntity | null> {
    return TaskModel.findByIdAndDelete(id);
  }

  async createSubTask(id: string, subTask: SubTaskEntity): Promise<SubTaskEntity[]> {
    const task = await TaskModel.findById(id);
    if (!task) {
      throw ApplicationError.badRequest(`Failed to create a subTask. Task with id=${id} not found.`);
    }

    task.subTasks.push(subTask);
    await task.save();
    return (task.subTasks as SubTaskDocument[]).map((subTask) => new SubTaskEntity(subTask.title, subTask.id));
  }
  async deleteSubTask(subTaskId: string): Promise<{ deleted: boolean }> {
    const subTaskObjectId = new mongoose.Types.ObjectId(subTaskId);
    const res: mongoose.UpdateWriteOpResult = await TaskModel.updateOne(
      {
        'subTasks._id': subTaskObjectId,
      },
      { $pull: { subTasks: { _id: subTaskObjectId } } },
    );
    return res.matchedCount === 1 ? { deleted: true } : { deleted: false };
  }
}
