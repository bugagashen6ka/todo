import { Schema, model } from 'mongoose';
import { TaskDocument } from '../../core/types/task.interface';
import { subTaskSchema } from './subTask';

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    completed: {
      type: Boolean,
      required: true,
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
