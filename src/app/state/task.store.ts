import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CreateTaskInput, Task, UpdateTaskInput, isOverdue } from '../models/task.model';
import { TaskApiService } from '../data/task-api.service';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly api = inject(TaskApiService);
  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);

  readonly totalCount = computed(() => this.tasks().length);
  readonly completedCount = computed(() => this.tasks().filter(task => task.status === 'completed').length);
  readonly inProgressCount = computed(() => this.tasks().filter(task => task.status === 'in-progress').length);
  readonly overdueCount = computed(() => this.tasks().filter(task => isOverdue(task)).length);

  loadTasks(): void {
    this.loading.set(true); this.error.set(null);
    this.api.getTasks().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: tasks => this.tasks.set(tasks.map(task => ({ ...task }))),
      error: () => this.error.set('We could not load your tasks. Please try again.')
    });
  }

  create(input: CreateTaskInput, onSuccess?: (task: Task) => void): void {
    this.mutate(() => this.api.createTask(input), task => {
      this.tasks.update(tasks => [...tasks, { ...task }]);
      this.notice.set('Task created successfully.'); onSuccess?.(task);
    }, 'We could not create the task.');
  }

  update(id: string, input: UpdateTaskInput, onSuccess?: (task: Task) => void): void {
    this.mutate(() => this.api.updateTask(id, input), task => {
      this.tasks.update(tasks => tasks.map(item => item.id === id ? { ...task } : item));
      this.notice.set('Task updated successfully.'); onSuccess?.(task);
    }, 'We could not update the task.');
  }

  delete(id: string): void {
    this.mutate(() => this.api.deleteTask(id), () => {
      this.tasks.update(tasks => tasks.filter(task => task.id !== id));
      this.notice.set('Task deleted successfully.');
    }, 'We could not delete the task.');
  }

  clearFeedback(): void { this.notice.set(null); this.error.set(null); }

  private mutate<T>(request: () => import('rxjs').Observable<T>, success: (value: T) => void, message: string): void {
    this.saving.set(true); this.error.set(null); this.notice.set(null);
    request().pipe(finalize(() => this.saving.set(false))).subscribe({
      next: value => success(value),
      error: () => this.error.set(message)
    });
  }
}