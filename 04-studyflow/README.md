# StudyFlow — Design Patterns Web Prototype

StudyFlow is a local-first academic planner. A student can add assignments, exams, and projects, rank them with different priority strategies, mark work complete, filter the task board, and keep the plan in browser storage.

## Technologies

- Next.js 14 (App Router)
- React 18
- TypeScript
- Vitest + Testing Library for automated tests
- Browser `localStorage` for persistence

## Design patterns

### Factory

`patterns/factory/TaskFactory.ts:32-60` defines the concrete assignment, exam, and project products plus `TaskFactory.create`. The controller calls it at `controllers/useTaskController.ts:45` so the form does not construct task variants directly.

### Strategy

`patterns/strategy/PriorityStrategy.ts:8-12` defines the strategy contract, while the three concrete strategies at lines 51-76 implement interchangeable ranking algorithms. `getPriorityStrategy` at `patterns/strategy/PriorityStrategy.ts:84-86` selects the requested strategy and `applyPriority` at lines 88-91 applies it. The controller uses the strategy at `controllers/useTaskController.ts:49`.

### Repository

`repositories/TaskRepository.ts:16-20` defines the storage abstraction and `LocalStorageTaskRepository` at lines 22-56 implements loading, saving, corrupt-data recovery, and clearing. The page creates the repository at `app/page.tsx:15`, while the controller receives it by dependency injection at `app/page.tsx:16`.

### MVC-style separation

The model is the immutable task state and transitions in `domain/Task.ts` and `domain/TaskModel.ts:10-46`. The controller coordinates validation, Factory creation, Strategy ranking, filtering, and persistence in `controllers/useTaskController.ts:24-87`. The View is the React component tree in `app/page.tsx:18-21` and `components/`. This keeps UI rendering separate from domain transitions and application coordination.

## Run the project

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The default scripts are:

```bash
pnpm test:run   # 21 automated tests
pnpm typecheck
pnpm build
```

## Fresh-start notes

Tasks are stored under the browser key `studyflow.tasks.v1`. To reset the demo, use the browser's site storage controls or open a private window. No server database is required.
