"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/models/Task";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

/**
 * This page is the client-side "glue": it asks the API (which is
 * internally Controller -> Model) for data and passes it as props to
 * the pure View components (TaskForm, TaskList).
 */
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    if (data.ok) setTasks(data.data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(title: string) {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    loadTasks();
  }

  async function handleToggle(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "PATCH" });
    loadTasks();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  }

  return (
    <main className="container">
      <h1>🧩 MVC Pattern — Task List</h1>
      <p className="subtitle">
        <strong>Model</strong> (<code>models/Task.ts</code>) holds the data ·{" "}
        <strong>Controller</strong> (<code>controllers/TaskController.ts</code>)
        validates and orchestrates · <strong>View</strong> (
        <code>components/TaskForm.tsx</code>, <code>TaskList.tsx</code>) only
        presents.
      </p>

      <TaskForm onCreate={handleCreate} />
      <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
    </main>
  );
}
