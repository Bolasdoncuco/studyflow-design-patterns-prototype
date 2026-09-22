"use client";

import type { Task } from "@/models/Task";

/**
 * MVC PATTERN — VIEW layer (part 2)
 * Receives already-resolved data (props) and is only responsible for
 * RENDERING it. The onToggle/onDelete callbacks delegate the action
 * upward; this component never calls fetch or knows about the
 * /api/* routes.
 */
export default function TaskList({
  tasks,
  onToggle,
  onDelete,
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (tasks.length === 0) return <p className="empty">No tasks yet.</p>;

  return (
    <ul className="task-list">
      {tasks.map((t) => (
        <li key={t.id} className={t.completed ? "done" : ""}>
          <label>
            <input type="checkbox" checked={t.completed} onChange={() => onToggle(t.id)} />
            <span>{t.title}</span>
          </label>
          <button className="delete" onClick={() => onDelete(t.id)}>
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
