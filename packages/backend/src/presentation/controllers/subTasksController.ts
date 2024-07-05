import { NextFunction, Response, Request } from 'express';
import { CreateSubTaskUseCase } from '../../domain/useCases/subTasks/CreateSubTaskUseCase';
import { DeleteSubTaskUseCase } from '../../domain/useCases/subTasks/DeleteSubTaskUseCase';
import { ExpressBodyRequest, ExpressParamsRequest } from '../../core/types/ExpressRequest';
import { SubTask } from '../../core/types/subtask.interface';
import { ApplicationError } from '../../core/utils/errors/applicationError';
import { HttpStatusCode } from '../../core/utils/httpStatusCode';

export class SubTasksController {
  constructor(
    private createSubTaskUseCase: CreateSubTaskUseCase,
    private deleteSubTaskUseCase: DeleteSubTaskUseCase,
  ) {}
  public createSubTask = async (
    req: ExpressBodyRequest<{ id: string } & { subTask: SubTask }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id, subTask } = req.body;
      const subTasks = await this.createSubTaskUseCase.execute(id, subTask);
      if (!subTasks) {
        throw ApplicationError.notFound(`Could not create subTask for task id ${id}`);
      }
      res.statusCode = 201;
      res.send(subTasks);
    } catch (err) {
      next(err);
    }
  };
  public deleteSubTask = async (
    req: ExpressParamsRequest<{ subtaskid: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { subtaskid: subTaskId } = req.params;
      const result = await this.deleteSubTaskUseCase.execute(subTaskId);
      if (result.deleted === false) {
        throw ApplicationError.notFound(`Could not delete subTask ${subTaskId}`);
      }
      res.send(result);
    } catch (err) {
      next(err);
    }
  };
}
