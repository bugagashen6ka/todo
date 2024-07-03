import { Document } from 'mongoose';

export interface SubTask {
  title: string;
}

export interface SubTaskDocument extends Document, SubTask {}
