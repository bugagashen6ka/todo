import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksService } from '../../../shared/services/tasks.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { SubTasksComponent } from './subTasks.component';
import { BehaviorSubject, map } from 'rxjs';
import { SubTaskInterface } from '../../../shared/types/subTask.interface';
import { SubTasksService } from '../../../shared/services/subTasks.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SlidePanelComponent } from '../slide-panel/slide-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockAnimationDriver } from '@angular/animations/browser/testing';
import { AnimationDriver } from '@angular/animations/browser';
import { TaskInterface } from '../../../shared/types/task.interface';

describe('SubtasksComponent', () => {
  let component = SubTasksComponent.prototype;
  let fixture: ComponentFixture<SubTasksComponent>;
  let subTasksSubject: BehaviorSubject<SubTaskInterface[]>;
  let tasksService: TasksService;
  let subTasksService: SubTasksService;
  let formBuilder: FormBuilder;
  const taskId = '123';
  const subTaskId = '456';
  const dummySubTasks: SubTaskInterface[] = [
    {
      id: subTaskId,
      title: 'dummy subTitle',
    },
  ];
  const dummyTasks: TaskInterface[] = [
    {
      id: taskId,
      title: 'Work Hard',
      description: 'Eat Sleep Compute',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subTasks: [],
    },
  ];

  subTasksSubject = new BehaviorSubject<SubTaskInterface[]>(dummySubTasks);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubTasksComponent, SlidePanelComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        TasksService,
        SubTasksService,
        {
          provide: AnimationDriver,
          useClass: MockAnimationDriver,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SubTasksComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.form = formBuilder.group({
      title: new FormControl(
        {
          value: dummySubTasks[0].title,
          disabled: true,
        },
        Validators.required,
      ),
    });
    component.taskId = taskId;
    component.isOpen = true;
    component.subTasks$ = subTasksSubject.asObservable();
    tasksService = TestBed.inject(TasksService);
    tasksService.tasks$.next(dummyTasks);
    subTasksService = TestBed.inject(SubTasksService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('should get subTasks of the task', () => {
    const showTitle = fixture.debugElement.query(By.css(`[data-testid="showTitle"]`));

    expect(showTitle.nativeElement.textContent.trim()).toEqual(dummySubTasks[0].title);
  });

  it('should add a subTask with title', () => {
    jest.spyOn(subTasksService, 'createSubTask').mockImplementation(() => {});
    const titleInput = fixture.debugElement.query(By.css('[data-testid="newTitle"]'));
    titleInput.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    expect(subTasksService.createSubTask).toHaveBeenCalledWith(taskId, dummySubTasks[0].title);
  });

  it('should delete a subtask', () => {
    jest.spyOn(subTasksService, 'deleteSubTask').mockImplementation(() => {});

    const deleteButton = fixture.debugElement.query(By.css(`[data-testid="deleteButton"]`));
    deleteButton.nativeElement.click(subTaskId);

    expect(subTasksService.deleteSubTask).toHaveBeenCalledWith(taskId, subTaskId);
  });

  it('should close slide panel', () => {
    jest.spyOn(component.closeEvent, 'emit').mockImplementation(() => {});
    const closeSlidePanelButton = fixture.debugElement.query(By.css(`[data-testid="closeSlidePanelButton"]`));
    closeSlidePanelButton.nativeElement.click();

    expect(component.closeEvent.emit).toHaveBeenCalled();
    expect(component.isOpen).toBe(false);
  });

  it('should get list of subTasks on ngOnChanges', () => {
    component.ngOnChanges();
    component.subTasks$!.subscribe((data) => {
      expect(data).toBe(dummySubTasks);
    });
  });
});
