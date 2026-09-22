import { beforeEach, describe, expect, it } from "vitest";
import { LocalStorageTaskRepository } from "@/repositories/TaskRepository";
import type { StudyTask } from "@/domain/Task";

const baseTask: StudyTask = {
  id: "task-1", title: "Patterns lab", course: "Web", kind: "assignment",
  dueDate: "2026-09-24", effortHours: 4, completed: false,
  createdAt: "2026-09-21T12:00:00.000Z", kindLabel: "Assignment", accent: "indigo",
  priorityScore: 50, priorityLevel: "medium",
};

describe("LocalStorageTaskRepository", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips tasks through storage", () => {
    const repository = new LocalStorageTaskRepository(localStorage, "test.tasks");
    expect(repository.save([baseTask])).toEqual({ ok: true });
    expect(repository.load()).toEqual({ tasks: [baseTask] });
  });

  it("recovers from corrupt JSON", () => {
    localStorage.setItem("test.tasks", "{broken");
    const result = new LocalStorageTaskRepository(localStorage, "test.tasks").load();
    expect(result).toEqual({ tasks: [], warning: "Saved tasks could not be read. A new list was started." });
  });

  it("reports write failures without throwing", () => {
    const storage = { getItem: () => null, setItem: () => { throw new Error("quota"); }, removeItem: () => undefined };
    expect(new LocalStorageTaskRepository(storage, "test.tasks").save([baseTask])).toEqual({
      ok: false,
      warning: "Changes are visible, but this browser could not save them.",
    });
  });
});
