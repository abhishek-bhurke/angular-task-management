import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskApiService } from './task-api.service';

describe('TaskApiService', () => {
  let service: TaskApiService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(TaskApiService); service.resetForTesting(); });

  it('creates, lists, updates and deletes tasks', fakeAsync(() => {
    let createdId = '';
    service.createTask({ title: 'Test task', description: '', status: 'todo', priority: 'low', dueDate: '2026-12-01' }).subscribe(task => createdId = task.id);
    tick(150);
    expect(createdId).toBeTruthy();
    let title = '';
    service.updateTask(createdId, { title: 'Updated task', description: '', status: 'completed', priority: 'high', dueDate: '2026-12-02' }).subscribe(task => title = task.title);
    tick(150);
    expect(title).toBe('Updated task');
    let listed = 0;
    service.getTasks().subscribe(tasks => listed = tasks.length);
    tick(250);
    expect(listed).toBe(1);
    let deleted = false;
    service.deleteTask(createdId).subscribe(() => deleted = true);
    tick(150);
    expect(deleted).toBeTrue();
  }));

  it('emits an error when updating a missing task', () => {
    let message = '';
    service.updateTask('missing', { title: 'x', description: '', status: 'todo', priority: 'low', dueDate: '2026-12-01' })
      .subscribe({ error: (error: Error) => message = error.message });
    expect(message).toBe('Task not found.');
  });
});