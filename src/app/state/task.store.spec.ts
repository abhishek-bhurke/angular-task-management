import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { TaskApiService } from '../data/task-api.service';
import { TaskStore } from './task.store';

describe('TaskStore', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('derives dashboard counts from the task list', fakeAsync(() => {
    const api = TestBed.inject(TaskApiService);
    api.resetForTesting([
      { id: '1', title: 'Done', status: 'completed', priority: 'low', dueDate: '2026-01-01' },
      { id: '2', title: 'Active', status: 'in-progress', priority: 'high', dueDate: '2099-01-01' }
    ]);
    const store = TestBed.inject(TaskStore);
    store.loadTasks();
    tick(250);
    expect(store.totalCount()).toBe(2);
    expect(store.completedCount()).toBe(1);
    expect(store.inProgressCount()).toBe(1);
  }));

  it('exposes a friendly error and clears loading when the API fails', () => {
    const store = TestBed.inject(TaskStore);
    const api = TestBed.inject(TaskApiService);
    spyOn(api, 'getTasks').and.returnValue(throwError(() => new Error('Network unavailable')));
    store.loadTasks();
    expect(store.error()).toBe('We could not load your tasks. Please try again.');
    expect(store.loading()).toBeFalse();
  });
});
