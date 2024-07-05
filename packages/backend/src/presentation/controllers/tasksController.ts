import { NextFunction, Response, Request } from 'express';
import { ApplicationError } from '../../core/utils/errors/applicationError';
import { GetAllTasksUseCase } from '../../domain/useCases/tasks/GetAllTasksUseCase';
import { CreateTaskUseCase } from '../../domain/useCases/tasks/CreateTaskUseCase';
import { GetTaskUseCase } from '../../domain/useCases/tasks/GetTaskUseCase';
import { UpdateTaskUseCase } from '../../domain/useCases/tasks/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../domain/useCases/tasks/DeleteTaskUseCase';
import { ExpressBodyRequest, ExpressParamsRequest } from '../../core/types/ExpressRequest';
import { BaseTask } from '../../core/types/task.interface';

export class TasksController {
  constructor(
    private getAllTasksUseCase: GetAllTasksUseCase,
    private getTaskUseCase: GetTaskUseCase,
    private createTaskUseCase: CreateTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
  ) {}
  public getTasks = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.getAllTasksUseCase.execute();
      res.send(tasks);
    } catch (err) {
      next(err);
    }
  };

  public getTask = async (req: ExpressParamsRequest<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const task = await this.getTaskUseCase.execute(req.params.id);
      if (!task || Object.keys(task).length === 0) {
        throw ApplicationError.notFound(`Failed to find task with id=${req.params.id}.`);
      }
      res.send(task);
    } catch (err) {
      next(err);
    }
  };

  public createTask = async (req: ExpressBodyRequest<BaseTask>, res: Response, next: NextFunction) => {
    try {
      const createdTask = await this.createTaskUseCase.execute(
        req.body.title,
        req.body.description,
        req.body.completed,
      );
      res.statusCode = 201;
      res.send(createdTask);
    } catch (err) {
      next(err);
    }
  };

  public updateTask = async (req: ExpressBodyRequest<BaseTask & { id: string }>, res: Response, next: NextFunction) => {
    try {
      const updatedTask = await this.updateTaskUseCase.execute(
        req.body.id,
        req.body.title,
        req.body.description,
        req.body.completed,
      );
      if (!updatedTask) {
        throw ApplicationError.notFound(`Failed to update task with id=${req.body.id}.`);
      }
      res.send(updatedTask);
    } catch (err) {
      next(err);
    }
  };

  public deleteTask = async (req: ExpressParamsRequest<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const deletedTask = await this.deleteTaskUseCase.execute(req.params.id);
      if (!deletedTask) {
        throw ApplicationError.notFound(`Failed to delete task with id=${req.params.id}.`);
      }
      res.send(deletedTask);
    } catch (err) {
      next(err);
    }
  };
}
