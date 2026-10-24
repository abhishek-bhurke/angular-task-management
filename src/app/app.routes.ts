import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list.component';
import { TaskFormComponent } from './pages/task-form.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/:id/edit', component: TaskFormComponent },
  { path: '**', component: NotFoundComponent }
];