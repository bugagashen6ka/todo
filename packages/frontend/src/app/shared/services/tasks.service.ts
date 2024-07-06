import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskInterface } from '../types/task.interface';
import { SubTaskInterface } from '../types/subTask.interface';

@Injectable()
export class TasksService {
  tasks$ = new BehaviorSubject<TaskInterface[]>([]);
  editingTitleId$ = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {}

  getTasks(): void {
    const url = environment.apiUrl + '/tasks';
    this.http.get<TaskInterface[]>(url).subscribe((data) => {
      this.tasks$.next(data);
    });
  }

  createTask(title: string, description: string, completed: boolean): void {
    const url = environment.apiUrl + '/tasks';
    this.http
      .post<TaskInterface>(url, {
        title,
        description,
        completed,
      })
      .subscribe((task) => {
        const updatedTasks = [...this.tasks$.getValue(), task];
        this.tasks$.next(updatedTasks);
      });
  }

  updateTask(id: string, title: string, description: string, completed: boolean): void {
    const url = environment.apiUrl + '/tasks';
    this.http
      .put<TaskInterface>(url, {
        id,
        title,
        description,
        completed,
      })
      .subscribe((data) => {
        this.setUpdatedTask(data.id, data.title, data.description, data.completed);
      });
  }

  deleteTask(id: string): void {
    const url = environment.apiUrl + `/tasks/${id}`;
    this.http.delete<TaskInterface>(url).subscribe(() => {
      const currentTasks = this.tasks$.getValue().filter((task) => task.id !== id);
      this.tasks$.next(currentTasks);
    });
  }

  private setUpdatedTask(id: string, title: string, description: string, completed: boolean): void {
    const updatedTasks = this.tasks$.getValue().map((task) => {
      if (task.id === id) {
        return {
          ...task,
          title,
          description,
          completed,
        };
      }

      return task;
    });
    this.tasks$.next(updatedTasks);
  }
}
