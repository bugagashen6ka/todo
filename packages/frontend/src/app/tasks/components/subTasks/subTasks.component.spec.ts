import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksService } from '../../../shared/services/tasks.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubTasksComponent } from './subTasks.component';
import { BehaviorSubject, map } from 'rxjs';
import { SubTaskInterface } from '../../../shared/types/subTask.interface';
import { SubTasksService } from '../../../shared/services/subTasks.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

//Shallow testing
@Component({
  standalone: true,
  selector: 'app-slide-panel',
  template: '',
})
class SlidePanelComponentMock {
  @Input() isOpen = false;
  @Input() headerText = 'Slide Panel Header';
  @Output() onClose = new EventEmitter();
}

describe('SubtasksComponent', () => {
  let component = SubTasksComponent.prototype;
  let fixture: ComponentFixture<SubTasksComponent>;
  let subTasksSubject: BehaviorSubject<SubTaskInterface[]>;
  let tasksService: TasksService;
  let subTasksService: SubTasksService;
  let formBuilder: FormBuilder;
  const id = '123';
  const dummySubTasks: SubTaskInterface[] = [
    {
      id,
      title: 'dummy subTitle',
    },
  ];

  subTasksSubject = new BehaviorSubject<SubTaskInterface[]>(dummySubTasks);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubTasksComponent],
      imports: [
        HttpClientTestingModule,
        SlidePanelComponentMock,
        ReactiveFormsModule,
      ],
      providers: [TasksService, SubTasksService],
    })
      .overrideComponent(SubTasksComponent, {
        remove: { imports: [SubTasksComponent] },
        add: { imports: [SlidePanelComponentMock] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(SubTasksComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.form = formBuilder.group({
      title: new FormControl(
        {
          value: dummySubTasks[0].title,
          disabled: true,
        },
        Validators.required
      ),
    });
    component.taskId = '123';
    component.subTasks$ = subTasksSubject.asObservable();
    tasksService = TestBed.inject(TasksService);
    subTasksService = TestBed.inject(SubTasksService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  /*
  it('should get subTasks of the task', () => {
    const showTitle = fixture.debugElement.query(
      By.css(`[data-testid="showTitle"]`)
    );

    expect(showTitle.nativeElement.textContent.trim()).toEqual(
      dummySubTasks[0].title
    );
  });

  
  it('should activate editing mode and pass correct task id for title', () => {
    const showTitle = fixture.debugElement.query(
      By.css(`[data-testid="showTitle"]`)
    );
    showTitle.triggerEventHandler('click');

    expect(component.editingTaskId).toEqual(id);
    expect(component.editingProperty).toEqual('title');
  });

  it('should activate editing mode and pass correct task id for description', () => {
    const showDescription = fixture.debugElement.query(
      By.css(`[data-testid="showDescription"]`)
    );
    showDescription.triggerEventHandler('click');

    expect(component.editingTaskId).toEqual(id);
    expect(component.editingProperty).toEqual('description');
  });

  it('should change title of the task', () => {
    const editedTitle = 'new title';
    jest.spyOn(tasksService, 'updateTask').mockImplementation(() => {});
    component.setInEditMode(dummyTasks[0].id, 'title');
    fixture.detectChanges();
    const editTitle = fixture.debugElement.query(
      By.css(`[data-testid="editTitle"]`)
    );
    editTitle.nativeElement.value = editedTitle;
    editTitle.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter' })
    );

    expect(tasksService.updateTask).toHaveBeenCalledWith(
      id,
      editedTitle,
      dummyTasks[0].description,
      dummyTasks[0].completed
    );
  });

  it('should change description of the task', () => {
    const editedDescription = 'new description';
    jest.spyOn(tasksService, 'updateTask').mockImplementation(() => {});
    component.setInEditMode(dummyTasks[0].id, 'description');
    fixture.detectChanges();
    const editDescription = fixture.debugElement.query(
      By.css(`[data-testid="editDescription"]`)
    );
    editDescription.nativeElement.value = editedDescription;
    editDescription.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter' })
    );

    expect(tasksService.updateTask).toHaveBeenCalledWith(
      id,
      dummyTasks[0].title,
      editedDescription,
      dummyTasks[0].completed
    );
  });

  it('should change completion state of the task', () => {
    jest.spyOn(tasksService, 'updateTask').mockImplementation(() => {});

    const toggleTask = fixture.debugElement.query(
      By.css(`[data-testid="toggle"]`)
    );
    toggleTask.nativeElement.click();

    expect(tasksService.updateTask).toHaveBeenCalledWith(
      id,
      dummyTasks[0].title,
      dummyTasks[0].description,
      !dummyTasks[0].completed
    );
  });

  it('should delete the task', () => {
    jest.spyOn(tasksService, 'deleteTask').mockImplementation(() => {});

    const deleteButton = fixture.debugElement.query(
      By.css(`[data-testid="deleteButton"]`)
    );
    deleteButton.nativeElement.click();

    expect(tasksService.deleteTask).toHaveBeenCalledWith(id);
  });
  */
});
