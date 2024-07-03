import ToDoRepository from './data/repositories/ToDoRepository';
import { CreateSubTaskUseCase } from './domain/useCases/subTasks/CreateSubTaskUseCase';
import { DeleteSubTaskUseCase } from './domain/useCases/subTasks/DeleteSubTaskUseCase';
import { CreateTaskUseCase } from './domain/useCases/tasks/CreateTaskUseCase';
import { DeleteTaskUseCase } from './domain/useCases/tasks/DeleteTaskUseCase';
import { GetAllTasksUseCase } from './domain/useCases/tasks/GetAllTasksUseCase';
import { GetTaskUseCase } from './domain/useCases/tasks/GetTaskUseCase copy';
import { UpdateTaskUseCase } from './domain/useCases/tasks/UpdateTaskUseCase';
import { SubTasksController } from './presentation/controllers/subTasksController';
import { TasksController } from './presentation/controllers/tasksController';
import { TodoRouter } from './presentation/routes/todo-router';

const toDoRepository = new ToDoRepository();

const getAllTasksUseCase = new GetAllTasksUseCase(toDoRepository);
const getTaskUseCase = new GetTaskUseCase(toDoRepository);
const createTaskUseCase = new CreateTaskUseCase(toDoRepository);
const updateTaskUseCase = new UpdateTaskUseCase(toDoRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(toDoRepository);

const createSubTaskUseCase = new CreateSubTaskUseCase(toDoRepository);
const deleteSubTaskUseCase = new DeleteSubTaskUseCase(toDoRepository);

const tasksController = new TasksController(
  getAllTasksUseCase,
  getTaskUseCase,
  createTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
);
const subTasksController = new SubTasksController(createSubTaskUseCase, deleteSubTaskUseCase);

export const router = new TodoRouter(tasksController, subTasksController);
