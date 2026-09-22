export type TaskKind = "assignment" | "exam" | "project";
export type PriorityStrategyName = "deadline" | "effort" | "balanced";
export type PriorityLevel = "low" | "medium" | "high" | "urgent";

export interface TaskInput {
  title: string;
  course: string;
  kind: TaskKind;
  dueDate: string;
  effortHours: number;
}

export interface StudyTask extends TaskInput {
  id: string;
  completed: boolean;
  createdAt: string;
  kindLabel: string;
  accent: string;
  priorityScore: number;
  priorityLevel: PriorityLevel;
}

export type TaskValidationErrors = Partial<Record<keyof TaskInput, string>>;

export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateTaskInput(input: TaskInput, today = new Date()): TaskValidationErrors {
  const errors: TaskValidationErrors = {};
  if (!input.title.trim()) errors.title = "Title is required.";
  if (!input.course.trim()) errors.course = "Course is required.";
  if (!input.dueDate) errors.dueDate = "Due date is required.";
  else if (input.dueDate < toLocalDateKey(today)) errors.dueDate = "Due date cannot be in the past.";
  if (!Number.isFinite(input.effortHours) || input.effortHours < 1 || input.effortHours > 100) {
    errors.effortHours = "Effort must be between 1 and 100 hours.";
  }
  return errors;
}
