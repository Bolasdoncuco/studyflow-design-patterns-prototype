/**
 * MVC PATTERN — CONTROLLER layer
 * ------------------------------------------------------------------
 * The Controller receives user intent (via the API routes, which act
 * as the HTTP "front door"), validates input, calls the Model to
 * read/write data, and returns a response the View can consume. The
 * Controller does NOT know how to render HTML/JSX, and the Model
 * knows NOTHING about HTTP: that separation is the essence of the
 * pattern.
 * ------------------------------------------------------------------
 */

import { TaskModel } from "@/models/Task";

export const TaskController = {
  list() {
    return { ok: true, data: TaskModel.findAll() };
  },

  create(body: unknown) {
    const title = (body as { title?: string })?.title?.trim();
    if (!title) {
      return { ok: false, error: "Title is required", status: 400 };
    }
    const task = TaskModel.create(title);
    return { ok: true, data: task, status: 201 };
  },

  toggle(id: string) {
    const task = TaskModel.toggle(id);
    if (!task) {
      return { ok: false, error: "Task not found", status: 404 };
    }
    return { ok: true, data: task };
  },

  remove(id: string) {
    const removed = TaskModel.remove(id);
    if (!removed) {
      return { ok: false, error: "Task not found", status: 404 };
    }
    return { ok: true };
  },
};
