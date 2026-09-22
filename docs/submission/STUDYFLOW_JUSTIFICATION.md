# StudyFlow — Technology and Pattern Justification

## Problem and goal

StudyFlow is a small academic planner for students who need to turn a list of deadlines into a clear next action. The prototype supports three real task variants—assignments, exams, and projects—because those items have different meanings even though they share a task board. A user can enter a task, see its priority, change the ranking lens, complete it, filter the list, and reload the page without losing the plan.

## Technology choices

I selected Next.js with the App Router because it gives the prototype a realistic web application structure while keeping the project small. The page and components are easy to demonstrate live, and the framework includes the development server and production build commands required by the lab. React is a good fit for this dashboard because the form, filters, cards, and statistics all update when the task state changes. The component boundaries also make the View portion of the MVC-style design visible during the demonstration.

I chose TypeScript because task data has several related fields and several controlled values. Types such as `TaskKind`, `PriorityStrategyName`, and `StudyTask` make invalid combinations easier to catch before runtime. TypeScript also documents the contracts between the controller, Factory, strategies, repository, and components. Vitest and Testing Library provide fast tests for both pure domain logic and user-facing form behavior.

The prototype uses browser `localStorage` rather than a server database. This is appropriate for a self-contained classroom prototype: it demonstrates persistence across reloads without requiring credentials, a migration, or a separate service. The storage access is isolated behind a Repository, so a future version could replace it with an API or database without rewriting the controller or components.

## Pattern choices

The Factory pattern fits task creation because the form should request “assignment,” “exam,” or “project” without knowing how each concrete product is assembled. `TaskFactory.create` centralizes that decision. Adding another task kind therefore requires a new product and a factory registration rather than conditionals spread throughout the UI.

The Strategy pattern fits prioritization because students may prefer different planning lenses. A deadline-first strategy emphasizes urgency, an effort-first strategy surfaces larger tasks, and a balanced strategy combines both signals. The controller receives the selected strategy through `getPriorityStrategy`, so changing the selector changes the ranking algorithm without changing task creation, persistence, or rendering.

The Repository pattern fits persistence because storage is an infrastructure concern, not a UI concern. `LocalStorageTaskRepository` implements the `TaskRepository` contract and also handles malformed saved JSON and browser write failures. The controller is tested with an in-memory repository, which proves that the application logic does not depend directly on a browser API.

Finally, the application uses an MVC-style separation to combine the patterns coherently. The immutable task model owns transitions such as add, toggle, remove, filter, and summarize. `useTaskController` coordinates validation, Factory creation, Strategy ranking, and Repository persistence. React components render the View and send user events to controller callbacks. Each pattern solves a separate design pressure, so none is included only for its name.

## Trade-offs and future work

The local-first design is intentionally single-browser and does not synchronize between devices. A production version would add an authenticated API repository, conflict handling, and durable server storage. The current Factory registry and strategy map make those changes incremental. The prototype favors clarity for a five-to-seven-minute demonstration, while its contracts preserve a path to a larger application.
