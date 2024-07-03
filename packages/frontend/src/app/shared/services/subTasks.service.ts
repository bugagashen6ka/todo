import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskInterface } from '../types/task.interface';
import { SubTaskInterface } from '../types/subTask.interface';
import { TasksService } from './tasks.service';

@Injectable()
export class SubTasksService {
  tasksService = inject(TasksService);
  editingTitleId$ = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {}

  createSubTask(id: string, title: string): void {
    const url = environment.apiUrl + `/tasks/subtask`;
    this.http
      .patch<SubTaskInterface[]>(url, {
        id,
        subTask: {
          title,
        },
      })
      .subscribe((data) => {
        this.setCreatedSubTask(id, data);
      });
  }

  deleteSubTask(id: string, subTaskId: string): void {
    const url = environment.apiUrl + `/tasks/${id}/subtask/${subTaskId}`;
    this.http.delete<SubTaskInterface[]>(url).subscribe((data) => {
      this.setDeletedSubTask(id, subTaskId);
    });
  }

  private setCreatedSubTask(
    id: string,
    updatedSubTasks: SubTaskInterface[]
  ): void {
    const updatedTasks = this.tasksService.tasks$.getValue().map((task) => {
      if (task.id === id) {
        task.subTasks = updatedSubTasks;
        return task;
      }
      return task;
    });
    this.tasksService.tasks$.next(updatedTasks);
  }

  private setDeletedSubTask(id: string, subTaskId: string): void {
    const updatedTasks = this.tasksService.tasks$.getValue().map((task) => {
      const subTasks = task.subTasks.filter(
        (subTask) => subTask.id !== subTaskId
      );
      task.subTasks = subTasks;
      return task;
    });
    this.tasksService.tasks$.next(updatedTasks);
  }
}
