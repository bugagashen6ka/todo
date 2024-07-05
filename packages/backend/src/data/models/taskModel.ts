import { Schema, model } from 'mongoose';
import { TaskDocument } from '../../core/types/task.interface';
import { subTaskSchema } from './subTaskModel';

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    completed: {
      type: Boolean,
      required: [true, 'Completed status is required'],
    },
    subTasks: {
      type: [subTaskSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
const TaskModel = model<TaskDocument>('Task', taskSchema);
export default TaskModel;
