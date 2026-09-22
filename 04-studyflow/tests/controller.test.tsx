import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTaskController } from "@/controllers/useTaskController";
import type { TaskRepository, RepositoryLoadResult, RepositorySaveResult } from "@/repositories/TaskRepository";
import type { StudyTask, TaskInput } from "@/domain/Task";

class MemoryTaskRepository implements TaskRepository {
  saved: StudyTask[] = [];
  load(): RepositoryLoadResult { return { tasks: [] }; }
  save(tasks: StudyTask[]): RepositorySaveResult { this.saved = tasks; return { ok: true }; }
  clear(): RepositorySaveResult { this.saved = []; return { ok: true }; }
}

const validInput: TaskInput = {
  title: "Patterns lab", course: "Web Development", kind: "project",
  dueDate: "2026-09-24", effortHours: 6,
};

describe("useTaskController", () => {
  it("creates, persists, reprioritizes, toggles, and removes through one controller", () => {
    const repository = new MemoryTaskRepository();
    const { result } = renderHook(() => useTaskController(repository, {
      now: () => new Date("2026-09-21T12:00:00.000Z"),
      createId: () => "task-1",
    }));

    act(() => result.current.createTask(validInput));
    expect(result.current.tasks).toHaveLength(1);
    expect(repository.saved[0].id).toBe("task-1");

    act(() => result.current.changeStrategy("effort"));
    expect(result.current.tasks[0].id).toBe("task-1");

    act(() => result.current.toggleTask("task-1"));
    expect(result.current.tasks[0].completed).toBe(true);

    act(() => result.current.deleteTask("task-1"));
    expect(result.current.tasks).toEqual([]);
  });

  it("returns validation errors without persisting invalid input", () => {
    const repository = new MemoryTaskRepository();
    const { result } = renderHook(() => useTaskController(repository, { now: () => new Date("2026-09-21T12:00:00.000Z") }));
    act(() => result.current.createTask({ ...validInput, title: "   " }));
    expect(result.current.errors.title).toBe("Title is required.");
    expect(result.current.tasks).toEqual([]);
    expect(repository.saved).toEqual([]);
  });
});
