import { NextFunction, Response, Request } from "express";
import { ApplicationError } from "../../core/utils/errors/applicationError";
import { GetAllTasksUseCase } from "../../domain/useCases/tasks/GetAllTasksUseCase";
import { CreateTaskUseCase } from "../../domain/useCases/tasks/CreateTaskUseCase";
import { GetTaskUseCase } from "../../domain/useCases/tasks/GetTaskUseCase copy";
import { UpdateTaskUseCase } from "../../domain/useCases/tasks/UpdateTaskUseCase";
import { DeleteTaskUseCase } from "../../domain/useCases/tasks/DeleteTaskUseCase";

export class TasksController {
  constructor(
    private getAllTasksUseCase: GetAllTasksUseCase,
    private getTaskUseCase: GetTaskUseCase,
    private createTaskUseCase: CreateTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase
  ) {}
  public getTasks = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.getAllTasksUseCase.execute();
      res.send(tasks);
    } catch (err) {
      next(err);
    }
  };

  public getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.getTaskUseCase.execute(req.params.id);
      //TODO validation
      if (task) {
        res.send(task);
      }
    } catch (err) {
      next(err);
    }
  };

  public createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createdTask = await this.createTaskUseCase.execute(
        req.body.title,
        req.body.description,
        req.body.completed
      );
      res.statusCode = 201;
      res.send(createdTask);
    } catch (err) {
      next(err);
    }
  };

  public updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updatedTask = await this.updateTaskUseCase.execute(
        req.body.id,
        req.body.title,
        req.body.description,
        req.body.completed
      );
      if (!updatedTask) {
        throw ApplicationError.notFound(
          `Failed to update task with id=${req.body.taskId}.`
        );
      }
      res.send(updatedTask);
    } catch (err) {
      next(err);
    }
  };

  public deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deletedTask = await this.deleteTaskUseCase.execute(req.params.id);
      console.log(deletedTask);
      if (!deletedTask) {
        throw ApplicationError.notFound(
          `Failed to delete task with id=${req.params.id}.`
        );
      }
      res.send(deletedTask);
    } catch (err) {
      next(err);
    }
  };
}
