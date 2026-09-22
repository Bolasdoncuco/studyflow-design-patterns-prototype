/**
 * MVC PATTERN — MODEL layer
 * ------------------------------------------------------------------
 * The Model knows about the DATA and the business rules for the
 * entity. It knows nothing about HTTP, React, or how it will be
 * displayed. We could swap this file for Prisma/Postgres without
 * touching the Controller or the View, as long as the same shape
 * (the "interface" the rest of the layers expect) is preserved.
 * ------------------------------------------------------------------
 */

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

// In-memory "database" for teaching purposes.
let tasks: Task[] = [
  { id: "1", title: "Research the Singleton pattern", completed: true, createdAt: new Date().toISOString() },
  { id: "2", title: "Research the Factory pattern", completed: true, createdAt: new Date().toISOString() },
  { id: "3", title: "Build the MVC prototype", completed: false, createdAt: new Date().toISOString() },
];

export const TaskModel = {
  findAll(): Task[] {
    return tasks;
  },

  create(title: string): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks = [newTask, ...tasks];
    return newTask;
  },

  toggle(id: string): Task | null {
    let updated: Task | null = null;
    tasks = tasks.map((t) => {
      if (t.id === id) {
        updated = { ...t, completed: !t.completed };
        return updated;
      }
      return t;
    });
    return updated;
  },

  remove(id: string): boolean {
    const before = tasks.length;
    tasks = tasks.filter((t) => t.id !== id);
    return tasks.length < before;
  },
};
