import { Schema, model } from 'mongoose';
import { SubTaskDocument } from '../../core/types/subtask.interface';

export const subTaskSchema = new Schema<SubTaskDocument>({
  title: {
    type: String,
    required: [true, 'SubTask title is required'],
  },
});

subTaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default model<SubTaskDocument>('SubTask', subTaskSchema);
