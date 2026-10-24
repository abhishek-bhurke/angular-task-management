export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}
export type CreateTaskInput = Omit<Task, 'id'>;
export type UpdateTaskInput = Omit<Task, 'id'>;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do', 'in-progress': 'In progress', completed: 'Completed'
};
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low', medium: 'Medium', high: 'High'
};
export function isOverdue(task: Task, today = new Date()): boolean {
  if (task.status === 'completed' || !task.dueDate) return false;
  const due = new Date(`${task.dueDate}T23:59:59`);
  return !Number.isNaN(due.getTime()) && due < today;
}