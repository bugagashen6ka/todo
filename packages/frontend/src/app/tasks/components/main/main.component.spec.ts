import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksService } from '../../../shared/services/tasks.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By, Title } from '@angular/platform-browser';
import { MainComponent } from './main.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubTasksComponent } from '../subTasks/subTasks.component';
import { TaskInterface } from '../../../shared/types/task.interface';
import { BehaviorSubject, map } from 'rxjs';

//Shallow testing
@Component({
  standalone: true,
  selector: 'app-tasks-subTasks',
  template: '',
})
class SubTasksComponentMock {
  @Input() isOpen = false;
  @Input() taskId: string | null = '';
  @Output() closeEvent = new EventEmitter<void>();
}

describe('MainComponent', () => {
  let component = MainComponent.prototype;
  let fixture: ComponentFixture<MainComponent>;
  let tasksSubject: BehaviorSubject<TaskInterface[]>;
  let tasksService: TasksService;
  const id = '123';
  const dummyTasks: TaskInterface[] = [
    {
      id,
      title: 'Work Hard',
      description: 'Eat Sleep Compute',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subTasks: [],
    },
  ];

  tasksSubject = new BehaviorSubject<TaskInterface[]>(dummyTasks);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [HttpClientTestingModule, SubTasksComponentMock],
      providers: [TasksService],
    })
      .overrideComponent(MainComponent, {
        remove: { imports: [SubTasksComponent] },
        add: { imports: [SubTasksComponentMock] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    component.tasks$ = tasksSubject.asObservable();

    tasksService = TestBed.inject(TasksService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('initialises correctly with given tasks', () => {
    jest.spyOn(tasksService, 'getTasks').mockImplementation(() => {});

    const showTitle = fixture.debugElement.query(By.css(`[data-testid="showTitle"]`));
    const showDescription = fixture.debugElement.query(By.css(`[data-testid="showDescription"]`));
    const todo = fixture.debugElement.query(By.css(`[data-testid="todo"]`));

    expect(showTitle.nativeElement.textContent.trim()).toEqual(dummyTasks[0].title);
    expect(showDescription.nativeElement.textContent.trim()).toEqual(dummyTasks[0].description);
    expect(todo.classes['editing']).not.toBeDefined();
  });

  it('should activate editing mode and pass correct task id for title', () => {
    const showTitle = fixture.debugElement.query(By.css(`[data-testid="showTitle"]`));
    showTitle.triggerEventHandler('click');

    expect(component.editingTaskId).toEqual(id);
    expect(component.editingProperty).toEqual('title');
  });

  it('should activate editing mode and pass correct task id for description', () => {
    const showDescription = fixture.debugElement.query(By.css(`[data-testid="showDescription"]`));
    showDescription.triggerEventHandler('click');

    expect(component.editingTaskId).toEqual(id);
    expect(component.editingProperty).toEqual('description');
  });

  it('should change title of the task', () => {
    const editedTitle = 'new title';
    jest.spyOn(tasksService, 'updateTask').mockImplementation(() => {});
    component.setInEditMode(dummyTasks[0].id, 'title');
    fixture.detectChanges();
    const editTitle = fixture.debugElement.query(By.css(`[data-testid="editTitle"]`));
    editTitle.nativeElement.value = editedTitle;
    editTitle.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

    expect(tasksService.updateTask).toHaveBeenCalledWith(
      id,
      editedTitle,
      dummyTasks[0].description,
      dummyTasks[0].completed,
    );
  });

  it('should change description of the task', () => {
    const editedDescription = 'new description';
    jest.spyOn(tasksService, 'updateTask').mockImplementation(() => {});
    component.setInEditMode(dummyTasks[0].id, 'description');
    fixture.detectChanges();
    const editDescription = fixture.debugElement.query(By.css(`[data-testid="editDescription"]`));
    editDescription.nativeElement.value = editedDescription;
    editDescription.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

    expect(tasksService.updateTask).toHaveBeenCalledWith(
      id,
      dummyTasks[0].title,
      editedDescription,
      dummyTasks[0].completed,
    );
  });

  it('should change completion state of the task', () => {
    jest.spyOn(tasksService, 'updateTask').mockImplementation(() => {});

    const toggleTask = fixture.debugElement.query(By.css(`[data-testid="toggle"]`));
    toggleTask.nativeElement.click();

    expect(tasksService.updateTask).toHaveBeenCalledWith(
      id,
      dummyTasks[0].title,
      dummyTasks[0].description,
      !dummyTasks[0].completed,
    );
  });

  it('should delete the task', () => {
    jest.spyOn(tasksService, 'deleteTask').mockImplementation(() => {});

    const deleteButton = fixture.debugElement.query(By.css(`[data-testid="deleteTaskButton"]`));
    deleteButton.nativeElement.click();

    expect(tasksService.deleteTask).toHaveBeenCalledWith(id);
  });
});
