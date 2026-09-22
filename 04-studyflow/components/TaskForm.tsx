"use client";

import React, { useState } from "react";
import type { TaskInput, TaskKind, TaskValidationErrors } from "@/domain/Task";

interface TaskFormProps {
  onSubmit(input: TaskInput): boolean;
  errors: TaskValidationErrors;
}

function defaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export default function TaskForm({ onSubmit, errors }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [kind, setKind] = useState<TaskKind>("assignment");
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [effortHours, setEffortHours] = useState("2");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const accepted = onSubmit({ title, course, kind, dueDate, effortHours: Number(effortHours) });
    if (accepted) {
      setTitle("");
      setCourse("");
      setKind("assignment");
      setEffortHours("2");
    }
  }

  return (
    <form className="task-form" onSubmit={submit} noValidate>
      <div className="form-heading"><p className="eyebrow">Add to your plan</p><h2>Capture the next win</h2></div>
      <label>Task title<input aria-describedby={errors.title ? "title-error" : undefined} aria-invalid={Boolean(errors.title)} aria-label="Task title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Read chapter 4" />{errors.title && <span id="title-error" className="field-error" role="alert">{errors.title}</span>}</label>
      <label>Course<input aria-describedby={errors.course ? "course-error" : undefined} aria-invalid={Boolean(errors.course)} aria-label="Course" value={course} onChange={(event) => setCourse(event.target.value)} placeholder="Software Architecture" />{errors.course && <span id="course-error" className="field-error" role="alert">{errors.course}</span>}</label>
      <div className="form-grid">
        <label>Task type<select aria-label="Task type" value={kind} onChange={(event) => setKind(event.target.value as TaskKind)}><option value="assignment">Assignment</option><option value="exam">Exam</option><option value="project">Project</option></select></label>
        <label>Due date<input aria-label="Due date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />{errors.dueDate && <span className="field-error" role="alert">{errors.dueDate}</span>}</label>
      </div>
      <label>Estimated effort <span className="muted">(hours)</span><input aria-label="Estimated effort" type="number" min="1" max="100" value={effortHours} onChange={(event) => setEffortHours(event.target.value)} />{errors.effortHours && <span className="field-error" role="alert">{errors.effortHours}</span>}</label>
      <button className="primary-button" type="submit">Add task <span aria-hidden="true">↗</span></button>
    </form>
  );
}
