import { BaseTask, TaskDocument } from '../../../src/core/types/task.interface';
import TaskModel from '../../../src/data/models/taskModel';
import TaskEntity from '../../../src/domain/entities/TaskEntity';
import { expect } from '@jest/globals';
import { ApplicationError } from '../../../src/core/utils/errors/applicationError';
import ToDoRepository from '../../../src/data/repositories/toDoRepository';

describe('ToDoRepository', () => {
  let toDoRepository: ToDoRepository;
  const baseTask: BaseTask = {
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
  };
  const dummyTask: TaskEntity = {
    ...baseTask,
    ...{
      createdAt: new Date(),
      updatedAt: new Date(),
      subTasks: [],
    },
  };

  const dummySubTask = { title: 'Sub Task' };

  beforeEach(() => {
    toDoRepository = new ToDoRepository();
  });

  it('should get all tasks', async () => {
    const createdTask = new TaskModel(baseTask);
    await createdTask.save();

    const tasks = await toDoRepository.getTasks();

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe(baseTask.title);
    expect(tasks[0].description).toBe(baseTask.description);
    expect(tasks[0].completed).toBe(baseTask.completed);
  });

  it('should create a new task', async () => {
    const task = await toDoRepository.createTask(dummyTask.title, dummyTask.description, dummyTask.completed);
    const savedTask: TaskDocument | null = await TaskModel.findById(task.id);

    expect(savedTask!.title).toBe(dummyTask.title);
    expect(savedTask!.description).toBe(dummyTask.description);
    expect(savedTask!.completed).toBe(false);
    expect(savedTask!.subTasks).toEqual(dummyTask.subTasks);
  });

  it('should get a task by id', async () => {
    const task = new TaskModel(baseTask);
    await task.save();

    const fetchedTask = await toDoRepository.getTask(task.id);

    expect(fetchedTask!.title).toBe(dummyTask.title);
    expect(fetchedTask!.description).toBe(dummyTask.description);
    expect(fetchedTask!.completed).toBe(dummyTask.completed);
  });

  it('should update a task', async () => {
    const updatedTaskTitle = 'Updated Task';
    const updatedTaskDescription = 'Updated Description';
    const task = new TaskModel(baseTask);
    await task.save();

    const updatedTask = await toDoRepository.updateTask(
      task.id,
      updatedTaskTitle,
      updatedTaskDescription,
      !dummyTask.completed,
    );
    expect(updatedTask).toBeDefined();
    expect(updatedTask!.title).toBe(updatedTaskTitle);
    expect(updatedTask!.description).toBe(updatedTaskDescription);
    expect(updatedTask!.completed).toBe(!dummyTask.completed);
  });

  it('should delete a task', async () => {
    const task = new TaskModel(baseTask);
    await task.save();

    const deletedTask = await toDoRepository.deleteTask(task.id);
    const fetchedTask = await TaskModel.findById(task.id);

    expect(deletedTask).toBeDefined();
    expect(fetchedTask).toBeNull();
  });

  it('should create a sub-task', async () => {
    const task = new TaskModel({ ...baseTask, subTasks: [] });
    await task.save();

    await toDoRepository.createSubTask(task.id, dummySubTask);

    const updatedTask = await TaskModel.findById(task.id);
    expect(updatedTask!.subTasks).toHaveLength(1);
    expect(updatedTask!.subTasks[0].title).toBe(dummySubTask.title);
  });

  it('should throw error if tries to create a sub-task but task does not exist', async () => {
    const nonExistingId = '668698b8c86954cb344e9c23';
    await expect(toDoRepository.createSubTask(nonExistingId, dummySubTask)).rejects.toThrow(ApplicationError);
  });

  it('should delete a sub-task', async () => {
    const task = new TaskModel({
      title: dummyTask.title,
      description: dummyTask.description,
      completed: dummyTask.completed,
      subTasks: [{ title: dummySubTask.title }],
    });
    await task.save();
    const updatedTask = await TaskModel.findById(task.id);
    const subTaskId = (updatedTask as TaskEntity).subTasks[0].id;
    const result = await toDoRepository.deleteSubTask(subTaskId!);
    const taskWithoutSuabTask = await TaskModel.findById(task.id);

    expect(result.deleted).toBe(true);
    expect(taskWithoutSuabTask!.subTasks).toHaveLength(0);
  });

  it('should return deleted:false if tries to delete a sub-task that does not exist', async () => {
    const nonExistingSubTaskId = '668698b8c86954cb344e9c24';
    expect(await toDoRepository.deleteSubTask(nonExistingSubTaskId)).toStrictEqual({ deleted: false });
  });
});
