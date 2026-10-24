import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CreateTaskInput, Task, UpdateTaskInput } from '../models/task.model';

/** Mock API adapter. Replace methods with HttpClient requests when a backend is available. */
@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private tasks: Task[] = [
    { id: 'task-1001', title: 'Prepare project kickoff',
      description: 'Collect goals, stakeholders, and milestones for the kickoff meeting.',
      status: 'in-progress', priority: 'high', dueDate: this.daysFromNow(1) },
    { id: 'task-1002', title: 'Review onboarding flow',
      description: 'Check the new user journey and note usability issues.',
      status: 'todo', priority: 'medium', dueDate: this.daysFromNow(-2) },
    { id: 'task-1003', title: 'Update component documentation',
      description: 'Document reusable UI components and their public inputs.',
      status: 'completed', priority: 'low', dueDate: this.daysFromNow(-1) },
    { id: 'task-1004', title: 'Write API integration tests',
      description: 'Cover success and failure scenarios for task operations.',
      status: 'todo', priority: 'high', dueDate: this.daysFromNow(4) }
  ];

  getTasks(): Observable<Task[]> { return of(this.clone(this.tasks)).pipe(delay(250)); }

  createTask(input: CreateTaskInput): Observable<Task> {
    const task: Task = { ...input, id: this.createId() };
    this.tasks = [...this.tasks, task];
    return of({ ...task }).pipe(delay(150));
  }

  updateTask(id: string, input: UpdateTaskInput): Observable<Task> {
    if (!this.tasks.some(task => task.id === id)) return throwError(() => new Error('Task not found.'));
    const updated: Task = { ...input, id };
    this.tasks = this.tasks.map(task => task.id === id ? updated : task);
    return of({ ...updated }).pipe(delay(150));
  }

  deleteTask(id: string): Observable<void> {
    if (!this.tasks.some(task => task.id === id)) return throwError(() => new Error('Task not found.'));
    this.tasks = this.tasks.filter(task => task.id !== id);
    return of(void 0).pipe(delay(150));
  }

  resetForTesting(tasks: Task[] = []): void { this.tasks = this.clone(tasks); }
  private clone(tasks: Task[]): Task[] { return tasks.map(task => ({ ...task })); }
  private createId(): string { return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
  private daysFromNow(offset: number): string {
    const date = new Date(); date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
}