# StudyFlow Design Specification

## Purpose

StudyFlow is a small academic task planner for students. It lets a student create assignments, exams, and projects; calculate priority using a selectable strategy; mark work complete; filter the list; delete tasks; and keep the collection after a browser reload.

The project will be implemented in English as an independent Next.js prototype in `04-studyflow`. The three primary web technologies are Next.js, React, and TypeScript. Browser Web Storage provides local persistence, and Vitest provides focused automated checks.

## Scope

The prototype includes:

- A task form with title, course, task type, due date, and estimated effort.
- Factory-created task variants for Assignment, Exam, and Project.
- Runtime selection of deadline-first, effort-first, or balanced priority calculation.
- Completion, deletion, filtering, and persistence after reload.
- Visible validation and storage error messages.
- README documentation with exact final file and line references.
- Part A analysis tables for the instructor examples.
- An English justification document and a short demo script.

The prototype does not include authentication, a remote database, accounts, collaboration, notifications, or deployment.

## Pattern architecture

### MVC

The Model contains the task type, validation rules, and pure state transitions. View components render forms, filters, statistics, and task cards; they do not access storage. The Controller hook receives view actions, coordinates the factory, strategy, model, and repository, then exposes state and callbacks to the view.

### Factory

`TaskFactory` accepts a task kind and normalized form input. It returns a common `StudyTask` product with type-specific defaults and metadata. The View and Controller do not instantiate concrete task variants directly.

### Strategy

`PriorityStrategy` defines a common calculation contract. Deadline, effort, and balanced strategies implement the contract independently. The Controller selects the active strategy at runtime and uses it to calculate each task's priority label and score.

### Repository

`TaskRepository` defines load, save, and clear operations. `LocalStorageTaskRepository` implements that interface and handles JSON parsing and storage failures. The Controller depends on the interface rather than on `window.localStorage` directly.

## Data flow

1. A View form emits a create action.
2. The Controller validates the action and calls `TaskFactory`.
3. The Factory returns a concrete task product with type-specific defaults.
4. The active Strategy calculates the task priority.
5. The Model applies domain validation and state transitions.
6. The Repository persists the updated collection.
7. The Controller exposes updated state and messages to the View.

The same Controller path handles completion, deletion, filtering, and strategy changes.

## Error handling

- Empty or invalid fields are rejected with field-level English messages.
- Invalid stored JSON is ignored and replaced with an empty collection plus a recoverable notice.
- Storage write failures keep the in-memory update visible but show a persistence warning.
- No UI action is represented as successful when its domain operation fails.

## Verification plan

- Run `npm install` in `04-studyflow` from a clean packaged copy.
- Run unit tests covering Factory products, each Strategy, Model validation, and Repository persistence behavior.
- Run the TypeScript/Next.js production build.
- Run the development server and verify create, filter, strategy change, complete, delete, and reload persistence in a browser.
- Generate final line-numbered references after implementation.
- Package the project and documentation in a ZIP without `node_modules` or build caches.

## Deliverables

- `04-studyflow/` source code and README.
- `PART_A_ANALYSIS.md` and a Word copy of the completed tables.
- `STUDYFLOW_JUSTIFICATION.md` and a Word copy of the 1–2 page justification.
- `DEMO_SCRIPT.md` for the 5–7 minute presentation.
- A submission ZIP containing source and documentation.
