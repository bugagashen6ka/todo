import { Component } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { Observable, map } from 'rxjs';
import { TaskInterface } from '../../../shared/types/task.interface';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-tasks-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder,
  ) {}

  onSubmit(): void {
    if (this.form.value.title && this.form.value.description) {
      this.tasksService.createTask(this.form.value.title, this.form.value.description, false);
    }
    this.form.reset();
  }
}
