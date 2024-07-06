import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { TaskInterface } from '../../../shared/types/task.interface';
import { map } from 'rxjs/operators';
import { SubTasksService } from '../../../shared/services/subTasks.service';
import { SubTaskInterface } from '../../../shared/types/subTask.interface';
import { TasksService } from '../../../shared/services/tasks.service';

@Component({
  selector: 'app-tasks-subTasks',
  templateUrl: './subTasks.component.html',
})
export class SubTasksComponent implements OnChanges {
  subTasks$: Observable<SubTaskInterface[]> | undefined;
  @Input() isOpen = false;
  @Input() taskId: string | null = '';
  @Output() closeEvent = new EventEmitter<void>();
  form = this.fb.group({
    title: ['', Validators.required],
  });

  constructor(
    private tasksService: TasksService,
    private subTasksService: SubTasksService,
    private fb: FormBuilder,
  ) {}

  ngOnChanges(): void {
    if (this.taskId) {
      this.subTasks$ = this.tasksService.tasks$.pipe(
        map((tasks) => {
          const matchedTask = tasks.find((task) => task.id === this.taskId);
          return matchedTask ? matchedTask.subTasks : [];
        }),
      );
    }
  }

  onCloseSlidePanel() {
    this.isOpen = false;
    this.closeEvent.emit();
  }

  onSubmit(): void {
    if (this.taskId && this.form.value.title) {
      this.subTasksService.createSubTask(this.taskId, this.form.value.title);
    }
    this.form.reset();
  }

  onDelete(subTaskId: string): void {
    if (this.taskId) {
      this.subTasksService.deleteSubTask(this.taskId, subTaskId);
    }
  }
}
