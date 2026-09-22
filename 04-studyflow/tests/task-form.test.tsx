import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TaskForm from "@/components/TaskForm";

describe("TaskForm", () => {
  it("submits normalized task input through its callback", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} errors={{}} />);
    await user.type(screen.getByLabelText("Task title"), "Patterns lab");
    await user.type(screen.getByLabelText("Course"), "Full-Stack Web Development");
    await user.selectOptions(screen.getByLabelText("Task type"), "project");
    await user.type(screen.getByLabelText("Due date"), "2026-09-24");
    await user.clear(screen.getByLabelText("Estimated effort"));
    await user.type(screen.getByLabelText("Estimated effort"), "6");
    await user.click(screen.getByRole("button", { name: "Add task" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ kind: "project", effortHours: 6 }));
  });

  it("renders field errors accessibly", () => {
    render(<TaskForm onSubmit={vi.fn()} errors={{ title: "Title is required." }} />);
    expect(screen.getByText("Title is required.")).toHaveAttribute("role", "alert");
  });
});
