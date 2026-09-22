import { describe, expect, it } from "vitest";
import { validateTaskInput } from "@/domain/Task";

const today = new Date("2026-09-21T12:00:00.000Z");

describe("validateTaskInput", () => {
  it("rejects whitespace-only title and course", () => {
    expect(validateTaskInput({
      title: "   ", course: " ", kind: "assignment",
      dueDate: "2026-09-22", effortHours: 2,
    }, today)).toMatchObject({ title: "Title is required.", course: "Course is required." });
  });

  it("rejects a due date before today", () => {
    expect(validateTaskInput({
      title: "Lab", course: "Web Development", kind: "assignment",
      dueDate: "2026-09-20", effortHours: 2,
    }, today).dueDate).toBe("Due date cannot be in the past.");
  });
});
