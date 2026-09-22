import { describe, expect, it } from "vitest";
import { addTask, filterTasks, removeTask, reprioritizeTasks, summarizeTasks, toggleTask } from "@/domain/TaskModel";
import { getPriorityStrategy } from "@/patterns/strategy/PriorityStrategy";
import type { StudyTask } from "@/domain/Task";

const today = new Date("2026-09-21T12:00:00.000Z");
const baseTask: StudyTask = {
  id: "task-1", title: "Patterns lab", course: "Web", kind: "assignment",
  dueDate: "2026-09-24", effortHours: 4, completed: false,
  createdAt: "2026-09-21T12:00:00.000Z", kindLabel: "Assignment", accent: "indigo",
  priorityScore: 50, priorityLevel: "medium",
};
const completedExam: StudyTask = { ...baseTask, id: "task-2", kind: "exam", kindLabel: "Exam", completed: true };

describe("TaskModel", () => {
  it("adds without mutating the original list", () => {
    const original = [baseTask];
    const result = addTask(original, completedExam);
    expect(result).toEqual([completedExam, baseTask]);
    expect(original).toEqual([baseTask]);
  });

  it("toggles and removes by id", () => {
    expect(toggleTask([baseTask], baseTask.id)[0].completed).toBe(true);
    expect(removeTask([baseTask], baseTask.id)).toEqual([]);
  });

  it("filters by status and kind", () => {
    expect(filterTasks([baseTask, completedExam], { status: "completed", kind: "exam" })).toEqual([completedExam]);
  });

  it("reprioritizes every task without changing ids", () => {
    const laterTask = { ...baseTask, id: "task-3", dueDate: "2026-10-21" };
    const result = reprioritizeTasks([laterTask, baseTask, completedExam], getPriorityStrategy("deadline"), today);
    expect(result.map((task) => task.id)).toEqual([baseTask.id, completedExam.id, laterTask.id]);
  });

  it("summarizes active, completed, and urgent tasks", () => {
    expect(summarizeTasks([{ ...baseTask, priorityLevel: "urgent" }, completedExam])).toEqual({
      total: 2, active: 1, completed: 1, urgent: 1,
    });
  });
});
