"use client";

import { useState } from "react";

/**
 * MVC PATTERN — VIEW layer (part 1)
 * This component is ONLY responsible for presenting a form and
 * notifying the parent (via onCreate) when the user wants to create
 * a task. It knows nothing about fetch, the API, or the real data
 * model.
 */
export default function TaskForm({ onCreate }: { onCreate: (title: string) => void }) {
  const [title, setTitle] = useState("");

  return (
    <form
      className="task-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onCreate(title.trim());
        setTitle("");
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task..."
      />
      <button type="submit">Add</button>
    </form>
  );
}
