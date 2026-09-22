import { describe, expect, it } from "vitest";
import { TaskFactory } from "@/patterns/factory/TaskFactory";

const input = {
  title: "Patterns lab", course: "Web", kind: "assignment" as const,
  dueDate: "2026-09-24", effortHours: 4,
};
const context = { id: "task-1", createdAt: "2026-09-21T12:00:00.000Z" };

describe("TaskFactory", () => {
  it.each([
    ["assignment", "Assignment", "indigo"],
    ["exam", "Exam", "rose"],
    ["project", "Project", "amber"],
  ] as const)("creates the %s concrete product", (kind, label, accent) => {
    const task = TaskFactory.create(kind, { ...input, kind }, context);
    expect(task).toMatchObject({ id: "task-1", kind, kindLabel: label, accent, completed: false });
  });
});
