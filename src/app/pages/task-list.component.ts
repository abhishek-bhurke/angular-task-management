import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskPriority, TaskStatus, Task, isOverdue, PRIORITY_LABELS, STATUS_LABELS } from '../models/task.model';
import { TaskStore } from '../state/task.store';

@Component({
  standalone: true, selector: 'app-task-list', imports: [DatePipe, TitleCasePipe, RouterLink],
  template: `
    <section class="page-heading">
      <div><p class="eyebrow">WORKSPACE / OVERVIEW</p><h1>My tasks</h1>
        <p class="muted">Keep track of your work and make progress every day.</p></div>
      <a class="button primary" routerLink="/tasks/new"><span aria-hidden="true">＋</span> New task</a>
    </section>

    <section class="stats-grid" aria-label="Task summary">
      <article class="stat-card"><div class="stat-top"><span class="stat-icon lavender">▤</span><span class="stat-label">Total tasks</span></div><strong>{{ store.totalCount() }}</strong><span class="stat-foot">Across your workspace</span></article>
      <article class="stat-card"><div class="stat-top"><span class="stat-icon mint">✓</span><span class="stat-label">Completed</span></div><strong>{{ store.completedCount() }}</strong><span class="stat-foot">Tasks finished</span></article>
      <article class="stat-card"><div class="stat-top"><span class="stat-icon blue">◷</span><span class="stat-label">In progress</span></div><strong>{{ store.inProgressCount() }}</strong><span class="stat-foot">Currently moving</span></article>
      <article class="stat-card"><div class="stat-top"><span class="stat-icon peach">!</span><span class="stat-label">Overdue</span></div><strong>{{ store.overdueCount() }}</strong><span class="stat-foot">Need your attention</span></article>
    </section>

    @if (store.notice()) { <div class="alert success" role="status">{{ store.notice() }} <button class="alert-close" (click)="store.clearFeedback()" aria-label="Dismiss message">×</button></div> }
    @if (store.error()) { <div class="alert error" role="alert">{{ store.error() }} <button class="text-button" (click)="store.loadTasks()">Retry</button></div> }

    <section class="task-panel">
      <div class="panel-heading"><div><h2>All tasks</h2><p class="muted small">A clear view of everything on your plate.</p></div>
        <span class="count-pill">{{ visibleTasks().length }} shown</span></div>
      <div class="filters">
        <label class="search-box"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search tasks..." aria-label="Search tasks by title" [value]="search()" (input)="search.set($any($event.target).value)"></label>
        <label class="filter-control"><span class="sr-only">Filter by status</span><select [value]="statusFilter()" (change)="statusFilter.set($any($event.target).value)"><option value="all">All statuses</option><option value="todo">To do</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></label>
        <label class="filter-control"><span class="sr-only">Filter by priority</span><select [value]="priorityFilter()" (change)="priorityFilter.set($any($event.target).value)"><option value="all">All priorities</option><option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option></select></label>
      </div>

      @if (store.loading()) {
        <div class="loading-state" role="status"><span class="spinner"></span><p>Loading your tasks…</p></div>
      } @else if (visibleTasks().length === 0) {
        <div class="empty-state"><div class="empty-icon">⌕</div><h3>No tasks found</h3><p>Try changing your search or filters, or create a new task.</p><a class="button secondary" routerLink="/tasks/new">Create a task</a></div>
      } @else {
        <div class="table-wrap"><table><thead><tr><th scope="col">Task</th><th scope="col">Status</th><th scope="col">Priority</th><th scope="col">Due date</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>
          @for (task of visibleTasks(); track task.id) {
            <tr>
              <td><div class="task-title-cell"><span class="task-check" [class.checked]="task.status === 'completed'">{{ task.status === 'completed' ? '✓' : '' }}</span><div><strong>{{ task.title }}</strong>@if (task.description) { <p>{{ task.description }}</p> }</div></div></td>
              <td><span class="status-badge" [class.status-todo]="task.status === 'todo'" [class.status-progress]="task.status === 'in-progress'" [class.status-completed]="task.status === 'completed'"><span class="status-dot"></span>{{ statusLabel(task.status) }}</span></td>
              <td><span class="priority-label" [class.priority-high]="task.priority === 'high'" [class.priority-medium]="task.priority === 'medium'" [class.priority-low]="task.priority === 'low'"><span class="priority-dot"></span>{{ priorityLabel(task.priority) }}</span></td>
              <td><span [class.overdue-date]="overdue(task)">{{ task.dueDate | date:'MMM d, y' }}</span>@if (overdue(task)) { <span class="overdue-tag">Overdue</span> }</td>
              <td><div class="row-actions"><a class="icon-button" [routerLink]="['/tasks', task.id, 'edit']" [attr.aria-label]="'Edit ' + task.title" title="Edit task">✎</a><button class="icon-button danger-hover" (click)="deleteTask(task)" [attr.aria-label]="'Delete ' + task.title" title="Delete task">⌫</button></div></td>
            </tr>
          }
        </tbody></table></div>
      }
      <div class="panel-bottom"><span>Showing {{ visibleTasks().length }} of {{ store.totalCount() }} tasks</span><span class="legend"><i></i> Updated just now</span></div>
    </section>`,
})
export class TaskListComponent implements OnInit {
  readonly store = inject(TaskStore);
  readonly search = signal('');
  readonly statusFilter = signal('all');
  readonly priorityFilter = signal('all');
  readonly visibleTasks = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.store.tasks().filter(task =>
      task.title.toLowerCase().includes(term) &&
      (this.statusFilter() === 'all' || task.status === this.statusFilter()) &&
      (this.priorityFilter() === 'all' || task.priority === this.priorityFilter())
    );
  });
  ngOnInit(): void { if (this.store.tasks().length === 0) this.store.loadTasks(); }
  statusLabel(status: TaskStatus): string { return STATUS_LABELS[status]; }
  priorityLabel(priority: TaskPriority): string { return PRIORITY_LABELS[priority]; }
  overdue(task: Task): boolean { return isOverdue(task); }
  deleteTask(task: Task): void {
    if (globalThis.confirm(`Delete "${task.title}"? This action cannot be undone.`)) this.store.delete(task.id);
  }
}