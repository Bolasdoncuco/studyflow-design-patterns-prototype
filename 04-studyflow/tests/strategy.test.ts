import { describe, expect, it } from "vitest";
import { applyPriority, getPriorityStrategy } from "@/patterns/strategy/PriorityStrategy";
import type { StudyTask } from "@/domain/Task";

const today = new Date("2026-09-21T12:00:00.000Z");
const baseTask: StudyTask = {
  id: "task-1", title: "Patterns lab", course: "Web", kind: "assignment",
  dueDate: "2026-09-30", effortHours: 2, completed: false,
  createdAt: "2026-09-21T12:00:00.000Z", kindLabel: "Assignment", accent: "indigo",
  priorityScore: 0, priorityLevel: "low",
};

describe("priority strategies", () => {
  it("deadline strategy makes a task due tomorrow urgent", () => {
    const task = { ...baseTask, dueDate: "2026-09-22" };
    expect(applyPriority(task, getPriorityStrategy("deadline"), today).priorityLevel).toBe("urgent");
  });

  it("effort strategy gives a 12-hour task a high score", () => {
    const task = { ...baseTask, effortHours: 12 };
    expect(applyPriority(task, getPriorityStrategy("effort"), today).priorityLevel).toBe("high");
  });

  it("balanced strategy combines urgency and effort", () => {
    const task = { ...baseTask, dueDate: "2026-09-24", effortHours: 8 };
    expect(applyPriority(task, getPriorityStrategy("balanced"), today).priorityScore).toBeGreaterThan(60);
  });

  it("recalculation preserves identity and completion", () => {
    const result = applyPriority({ ...baseTask, completed: true }, getPriorityStrategy("deadline"), today);
    expect(result).toMatchObject({ id: baseTask.id, completed: true, title: baseTask.title });
  });
});
