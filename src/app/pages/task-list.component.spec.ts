import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TaskListComponent } from './task-list.component';
import { TaskStore } from '../state/task.store';

describe('TaskListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [provideRouter([]), {
        provide: TaskStore,
        useValue: {
          tasks: () => [], loading: () => false, error: () => null, notice: () => null,
          totalCount: () => 0, completedCount: () => 0, inProgressCount: () => 0, overdueCount: () => 0,
          loadTasks: jasmine.createSpy('loadTasks'), clearFeedback: jasmine.createSpy('clearFeedback'),
          delete: jasmine.createSpy('delete')
        }
      }]
    }).compileComponents();
  });

  it('shows an empty state when no tasks match', () => {
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No tasks found');
  });
});