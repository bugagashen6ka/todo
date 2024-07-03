import { Router } from "express";
import { TasksController } from "../controllers/tasksController";
import { SubTasksController } from "../controllers/subTasksController";

export class TodoRouter {
  constructor(
    private tasksController: TasksController,
    private subTasksController: SubTasksController
  ) {}

  getRoutes(): Router {
    const router = Router();

    router.get("/api/tasks", this.tasksController.getTasks);
    router.get("/api/tasks/:id", this.tasksController.getTask);
    router.post("/api/tasks", this.tasksController.createTask);
    router.put("/api/tasks", this.tasksController.updateTask);
    router.delete("/api/tasks/:id", this.tasksController.deleteTask);

    router.patch("/api/tasks/subtask", this.subTasksController.createSubTask);
    router.delete(
      "/api/tasks/:id/subtask/:subtaskid",
      this.subTasksController.deleteSubTask
    );

    return router;
  }
}
