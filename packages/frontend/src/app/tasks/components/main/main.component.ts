import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { Observable } from 'rxjs';
import { TaskInterface } from '../../../shared/types/task.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  tasks$: Observable<TaskInterface[]>;
  editingTaskId: string | null = null;
  editingProperty: string = '';
  editingTextTitle: string = '';
  editingTextDescription: string = '';
  isSlidePanelOpen = false;

  constructor(private tasksService: TasksService) {
    this.tasks$ = this.tasksService.tasks$;
  }

  ngOnInit(): void {
    this.tasksService.getTasks();
  }

  deleteTask(id: string) {
    this.tasksService.deleteTask(id);
  }

  setInEditMode(id: string, property: string): void {
    this.editingTaskId = id;
    this.editingProperty = property;
  }

  changeTask(
    taskId: string,
    title: string,
    description: string,
    completed: boolean
  ): void {
    this.tasksService.updateTask(taskId, title, description, completed);

    this.editingTaskId = null;
    this.editingTextTitle = '';
  }

  changeTextTitle(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editingTextTitle = value;
  }

  changeTextDescription(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editingTextDescription = value;
  }

  openSlidePanel(id: string) {
    this.isSlidePanelOpen = true;
    this.editingTaskId = id;
  }

  onCloseSlidePanel() {
    this.isSlidePanelOpen = false;
    this.editingTaskId = null;
  }
}
