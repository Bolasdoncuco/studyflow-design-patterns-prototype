"use client";

import type { StudyTask } from "@/domain/Task";

export default function TaskCard({ task, onToggle, onDelete }: { task: StudyTask; onToggle(id: string): void; onDelete(id: string): void }) {
  return (
    <article className={`task-card accent-${task.accent} ${task.completed ? "is-complete" : ""}`}>
      <div className="task-card-top"><span className="type-pill">{task.kindLabel}</span><span className={`priority priority-${task.priorityLevel}`}>{task.priorityLevel}</span></div>
      <h3>{task.title}</h3><p className="task-course">{task.course}</p>
      <div className="task-meta"><span>Due {task.dueDate}</span><span>{task.effortHours}h effort</span><span>{task.priorityScore}/100</span></div>
      <div className="task-actions"><button className="secondary-button" onClick={() => onToggle(task.id)}>{task.completed ? "Reopen" : "Mark complete"}</button><button className="icon-button" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}>×</button></div>
    </article>
  );
}
