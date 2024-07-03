import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TasksService } from '../../../shared/services/tasks.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component = HeaderComponent.prototype;
  let fixture: ComponentFixture<HeaderComponent>;
  let tasksService: TasksService;
  let formBuilder: FormBuilder;
  const dummyTitle = 'dummyTitle';
  const dummyDescription = 'dummyDescription';
  const dummyIsCompleted = false;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [TasksService, FormBuilder],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.form = formBuilder.group({
      title: new FormControl(
        {
          value: dummyTitle,
          disabled: true,
        },
        Validators.required
      ),
      description: new FormControl(
        {
          value: dummyDescription,
          disabled: true,
        },
        Validators.required
      ),
    });
    tasksService = TestBed.inject(TasksService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a task with title and description', () => {
    jest.spyOn(tasksService, 'createTask').mockImplementation(() => {});
    const titleInput = fixture.debugElement.query(
      By.css('[data-testid="newTitle"]')
    );
    titleInput.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter' })
    );
    const descriptionInput = fixture.debugElement.query(
      By.css('[data-testid="newDescription"]')
    );
    descriptionInput.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter' })
    );
    expect(tasksService.createTask).toHaveBeenCalledWith(
      dummyTitle,
      dummyDescription,
      dummyIsCompleted
    );
  });

  it('should not add a task without title and description', () => {
    const emptyValue = '';
    jest.spyOn(tasksService, 'createTask').mockImplementation(() => {});
    component.form = formBuilder.group({
      title: new FormControl(
        {
          value: emptyValue,
          disabled: true,
        },
        Validators.required
      ),
      description: new FormControl(
        {
          value: emptyValue,
          disabled: true,
        },
        Validators.required
      ),
    });
    const titleInput = fixture.debugElement.query(
      By.css('[data-testid="newTitle"]')
    );
    titleInput.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter' })
    );

    const descriptionInput = fixture.debugElement.query(
      By.css('[data-testid="newDescription"]')
    );
    descriptionInput.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter' })
    );
    expect(tasksService.createTask).not.toHaveBeenCalled;
  });
});
