import type { PriorityLevel, PriorityStrategyName, StudyTask } from "@/domain/Task";

export interface PriorityResult {
  score: number;
  level: PriorityLevel;
}

export interface PriorityStrategy {
  readonly name: PriorityStrategyName;
  readonly label: string;
  calculate(task: StudyTask, today?: Date): PriorityResult;
}

function levelFor(score: number): PriorityLevel {
  if (score >= 85) return "urgent";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function clamp(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function localMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function daysUntil(dueDate: string, today: Date): number {
  const [year, month, day] = dueDate.split("-").map(Number);
  const due = new Date(year, month - 1, day).getTime();
  return Math.ceil((due - localMidnight(today)) / 86_400_000);
}

function deadlineScore(task: StudyTask, today: Date): number {
  const days = daysUntil(task.dueDate, today);
  if (days <= 1) return 100;
  if (days <= 3) return 85;
  if (days <= 7) return 65;
  if (days <= 14) return 40;
  return 20;
}

function effortScore(task: StudyTask): number {
  if (task.effortHours >= 16) return 90;
  if (task.effortHours >= 10) return 70;
  if (task.effortHours >= 5) return 50;
  return 25;
}

class DeadlinePriorityStrategy implements PriorityStrategy {
  readonly name = "deadline" as const;
  readonly label = "Deadline first";
  calculate(task: StudyTask, today = new Date()): PriorityResult {
    const score = clamp(deadlineScore(task, today));
    return { score, level: levelFor(score) };
  }
}

class EffortPriorityStrategy implements PriorityStrategy {
  readonly name = "effort" as const;
  readonly label = "Effort first";
  calculate(task: StudyTask): PriorityResult {
    const score = clamp(effortScore(task));
    return { score, level: levelFor(score) };
  }
}

class BalancedPriorityStrategy implements PriorityStrategy {
  readonly name = "balanced" as const;
  readonly label = "Balanced";
  calculate(task: StudyTask, today = new Date()): PriorityResult {
    const score = clamp(deadlineScore(task, today) * 0.6 + effortScore(task) * 0.4);
    return { score, level: levelFor(score) };
  }
}

const strategies: Record<PriorityStrategyName, PriorityStrategy> = {
  deadline: new DeadlinePriorityStrategy(),
  effort: new EffortPriorityStrategy(),
  balanced: new BalancedPriorityStrategy(),
};

export function getPriorityStrategy(name: PriorityStrategyName): PriorityStrategy {
  return strategies[name];
}

export function applyPriority(task: StudyTask, strategy: PriorityStrategy, today = new Date()): StudyTask {
  const result = strategy.calculate(task, today);
  return { ...task, priorityScore: result.score, priorityLevel: result.level };
}
