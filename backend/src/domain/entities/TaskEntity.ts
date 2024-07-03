import SubTaskEntity from "./SubTaskEntity";

export default class TaskEntity {
  constructor(
    public title: string,
    public description: string,
    public completed: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public subTasks: SubTaskEntity[],
    public id?: string
  ) {}
}
