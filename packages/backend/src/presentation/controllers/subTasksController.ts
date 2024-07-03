import { NextFunction, Response, Request } from "express";
import { CreateSubTaskUseCase } from "../../domain/useCases/subTasks/CreateSubTaskUseCase";
import { DeleteSubTaskUseCase } from "../../domain/useCases/subTasks/DeleteSubTaskUseCase";

export class SubTasksController {
  constructor(
    private createSubTaskUseCase: CreateSubTaskUseCase,
    private deleteSubTaskUseCase: DeleteSubTaskUseCase
  ) {}
  public createSubTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, subTask } = req.body;
      const subTasks = await this.createSubTaskUseCase.execute(id, subTask);
      res.statusCode = 201;
      res.send(subTasks);
    } catch (err) {
      next(err);
    }
  };
  public deleteSubTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { subtaskid: subTaskId } = req.params;
      const deleted = await this.deleteSubTaskUseCase.execute(subTaskId);
      res.send(deleted);
    } catch (err) {
      next(err);
    }
  };
}
