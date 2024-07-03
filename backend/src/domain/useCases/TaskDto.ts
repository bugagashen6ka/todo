export class TaskDto {
  constructor(
    public title: string,
    public description: string,
    public completed: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public subTasks: { title: string }[],
    public id?: string
  ) {}
}
