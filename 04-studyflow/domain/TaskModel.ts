import type { PriorityStrategy } from "@/patterns/strategy/PriorityStrategy";
import type { StudyTask, TaskKind } from "@/domain/Task";
import { applyPriority as calculatePriority } from "@/patterns/strategy/PriorityStrategy";

export interface TaskFilter {
  status: "all" | "active" | "completed";
  kind: "all" | TaskKind;
}

export function addTask(tasks: StudyTask[], task: StudyTask): StudyTask[] {
  return [task, ...tasks];
}

export function toggleTask(tasks: StudyTask[], id: string): StudyTask[] {
  return tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
}

export function removeTask(tasks: StudyTask[], id: string): StudyTask[] {
  return tasks.filter((task) => task.id !== id);
}

export function reprioritizeTasks(tasks: StudyTask[], strategy: PriorityStrategy, today?: Date): StudyTask[] {
  return tasks
    .map((task, index) => ({ task: calculatePriority(task, strategy, today), index }))
    .sort((left, right) => right.task.priorityScore - left.task.priorityScore || left.index - right.index)
    .map(({ task }) => task);
}

export function filterTasks(tasks: StudyTask[], filter: TaskFilter): StudyTask[] {
  return tasks.filter((task) => {
    const statusMatches = filter.status === "all"
      || (filter.status === "active" && !task.completed)
      || (filter.status === "completed" && task.completed);
    const kindMatches = filter.kind === "all" || task.kind === filter.kind;
    return statusMatches && kindMatches;
  });
}

export function summarizeTasks(tasks: StudyTask[]) {
  return {
    total: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
    urgent: tasks.filter((task) => !task.completed && task.priorityLevel === "urgent").length,
  };
}
