import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { MainComponent } from '../main/main.component';
import { HeaderComponent } from '../header/header.component';
import { TasksService } from '../../../shared/services/tasks.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TasksComponent', () => {
  let component = TasksComponent.prototype;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
    }).compileComponents();
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('renders header', () => {
    const { debugElement } = fixture;
    const counter = debugElement.query(By.css('app-tasks-header'));
    expect(counter).toBeTruthy();
  });

  it('renders main', () => {
    const { debugElement } = fixture;
    const counter = debugElement.query(By.css('app-tasks-main'));
    expect(counter).toBeTruthy();
  });
});
