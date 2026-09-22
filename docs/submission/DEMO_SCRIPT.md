# StudyFlow — 5–7 Minute Demo Script

## 0:00–0:45 — Problem and stack

“StudyFlow is a local-first academic planner. I built it with Next.js, React, and TypeScript. The user can add assignments, exams, and projects, rank them, complete them, filter them, and reload the page with the plan preserved.”

## 0:45–2:00 — Add and inspect tasks

Create one assignment, one exam, and one project. Point out the calculated priority, effort, due date, and summary counters. Explain that the form submits a single `TaskInput`; it does not construct the concrete task object itself.

## 2:00–3:00 — Factory

Open `patterns/factory/TaskFactory.ts` and show the concrete products and `TaskFactory.create` at lines 32–60. Explain that the registry selects the product for Assignment, Exam, or Project. Then return to the form and add another task to show the behavior working.

## 3:00–4:00 — Strategy

Change the Priority Lens from Balanced to Deadline first, then Effort first. Show that the scores and order change while the task data stays the same. Point to `PriorityStrategy.ts` and explain the shared interface plus the three interchangeable algorithms.

## 4:00–5:00 — Repository and persistence

Mark a task complete and reload the page. Point out that the completed state remains because `LocalStorageTaskRepository` serializes the task list. Show its `load` and `save` methods and explain that a future API repository could implement the same interface.

## 5:00–6:15 — MVC-style structure

Show `domain/TaskModel.ts` as the Model, `useTaskController.ts` as the Controller, and `app/page.tsx` plus `components/` as the View. Explain the request flow: View event → controller validation → Factory → Strategy → model transition → Repository save → updated View.

## 6:15–6:45 — Verification and close

Show the terminal results for `npm run test:run`, `npm run typecheck`, and `npm run build`. Close by explaining that Factory, Strategy, Repository, and MVC separation were selected because they solve different responsibilities in this planner.
