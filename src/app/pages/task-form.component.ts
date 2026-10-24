import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskPriority, TaskStatus } from '../models/task.model';
import { TaskStore } from '../state/task.store';

@Component({
  standalone: true, selector: 'app-task-form', imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-heading form-heading"><div><p class="eyebrow">WORKSPACE / TASKS</p><h1>{{ isEdit ? 'Edit task' : 'Create a task' }}</h1><p class="muted">Add the details to keep your work organised.</p></div><a class="button secondary" routerLink="/tasks">← Back to tasks</a></section>
    @if (store.error()) { <div class="alert error" role="alert">{{ store.error() }}</div> }
    <section class="form-panel">
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="form-section-title"><span class="form-section-icon">✎</span><div><h2>Task details</h2><p class="muted small">Fields marked with <span class="required">*</span> are required.</p></div></div>
        <div class="form-field"><label for="title">Task title <span class="required">*</span></label><input id="title" type="text" formControlName="title" placeholder="e.g. Prepare project proposal" maxlength="120" [class.invalid]="showError('title')">
          @if (showError('title')) { <p class="field-error">{{ form.controls.title.hasError('required') ? 'Title is required.' : 'Title must contain at least 3 characters.' }}</p> }
        </div>
        <div class="form-field"><label for="description">Description <span class="optional">(optional)</span></label><textarea id="description" formControlName="description" rows="4" placeholder="Add context, notes, or details..."></textarea><span class="field-hint">Give your task enough context to make the next step clear.</span></div>
        <div class="form-two-col">
          <div class="form-field"><label for="status">Status <span class="required">*</span></label><select id="status" formControlName="status" [class.invalid]="showError('status')"><option value="todo">To do</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select>@if (showError('status')) { <p class="field-error">Status is required.</p> }</div>
          <div class="form-field"><label for="priority">Priority <span class="required">*</span></label><select id="priority" formControlName="priority" [class.invalid]="showError('priority')"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>@if (showError('priority')) { <p class="field-error">Priority is required.</p> }</div>
        </div>
        <div class="form-field date-field"><label for="dueDate">Due date <span class="required">*</span></label><input id="dueDate" type="date" formControlName="dueDate" [class.invalid]="showError('dueDate')">@if (showError('dueDate')) { <p class="field-error">Due date is required.</p> }</div>
        <div class="form-actions"><a class="button secondary" routerLink="/tasks">Cancel</a><button class="button primary" type="submit" [disabled]="store.saving()">{{ store.saving() ? 'Saving…' : (isEdit ? 'Save changes' : 'Create task') }}</button></div>
      </form>
    </section>`,
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(TaskStore);
  taskId: string | null = null;
  isEdit = false;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['todo' as TaskStatus, Validators.required],
    priority: ['medium' as TaskPriority, Validators.required],
    dueDate: ['', Validators.required]
  });

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.taskId;
    if (this.taskId) {
      const task = this.store.tasks().find(item => item.id === this.taskId);
      if (!task) {
        this.store.loadTasks();
        // If the task isn't in the store yet, populate the form after the API-backed list arrives.
        const check = window.setInterval(() => {
          const loaded = this.store.tasks().find(item => item.id === this.taskId);
          if (loaded) { this.form.patchValue(loaded); window.clearInterval(check); }
          if (!this.store.loading() && this.store.tasks().length > 0 && !loaded) {
            window.clearInterval(check); void this.router.navigate(['/tasks']);
          }
        }, 100);
      } else this.form.patchValue(task);
    }
  }

  showError(name: 'title' | 'status' | 'priority' | 'dueDate'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.store.saving()) return;
    const value = this.form.getRawValue();
    const input = { ...value, description: value.description.trim() || undefined };
    if (this.taskId) this.store.update(this.taskId, input, () => void this.router.navigate(['/tasks']));
    else this.store.create(input, () => void this.router.navigate(['/tasks']));
  }
}