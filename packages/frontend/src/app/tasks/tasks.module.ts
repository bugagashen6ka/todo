import { Component, NgModule } from '@angular/core';
import { TasksComponent } from './components/tasks/tasks.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { TasksService } from '../shared/services/tasks.service';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SlidePanelComponent } from './components/slide-panel/slide-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubTasksComponent } from './components/subTasks/subTasks.component';
import { SubTasksService } from '../shared/services/subTasks.service';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
  },
];
@NgModule({
  declarations: [TasksComponent, HeaderComponent, MainComponent, SlidePanelComponent, SubTasksComponent],
  imports: [CommonModule, BrowserAnimationsModule, RouterModule.forChild(routes), ReactiveFormsModule],
  providers: [provideHttpClient(), TasksService, SubTasksService],
})
export class TasksModule {}
