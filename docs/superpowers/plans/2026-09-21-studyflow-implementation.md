# StudyFlow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and package an English-language academic task planner that demonstrates MVC, Factory, Strategy, and Repository with working browser persistence and complete coursework documentation.

**Architecture:** A Next.js App Router page renders React View components. A controller hook coordinates pure domain/model functions, `TaskFactory`, runtime-selectable priority strategies, and a `TaskRepository` backed by browser localStorage. The instructor examples remain unchanged; analysis and submission documents live beside the independent `04-studyflow` project.

**Tech Stack:** Next.js 14.2.35, React 18.3.1, TypeScript 5.5.4, Web Storage API, Vitest, Testing Library, python-docx.

**Spec:** `docs/superpowers/specs/2026-09-21-studyflow-design.md`

## Global Constraints

- All user-facing application text and coursework deliverables must be in English.
- Create the prototype only under `04-studyflow`; do not modify `01-singleton`, `02-factory`, or `03-mvc`.
- Implement MVC, Factory, Strategy, and Repository as real collaborating structures, not names attached to unrelated functions.
- Persist tasks locally through the `TaskRepository` interface; Views must never call `localStorage`.
- Do not add authentication, a remote database, accounts, collaboration, notifications, or deployment.
- Do not execute Prisma database deletion, migration, reset, `db push`, `DROP`, or `TRUNCATE` commands.
- If Git is initialized during execution, use `feat/studyflow-prototype`; never use a `codex/` branch prefix.
- Final documentation line references must be calculated only after source code is stable.
- The final ZIP must exclude `node_modules`, `.next`, coverage output, render intermediates, and temporary files.

## Review Focus

- A title or course containing only whitespace must be rejected with a visible field error.
- A due date earlier than today must be rejected instead of creating an already-overdue task.
- Corrupt localStorage JSON must recover to an empty list and expose a non-fatal warning.
- A localStorage write failure must retain the in-memory task and expose a persistence warning.
- Changing the priority strategy must recalculate every task without changing identity, completion, or stored task details.

---

## Planned file structure

```text
04-studyflow/
├── app/
│   ├── globals.css                 # Responsive visual system and component states
│   ├── layout.tsx                  # Root metadata and document shell
│   └── page.tsx                    # MVC composition root
├── components/
│   ├── DashboardHeader.tsx         # Title, summary copy, strategy selector
│   ├── EmptyState.tsx              # Empty/filter state
│   ├── TaskCard.tsx                # One task View
│   ├── TaskFilters.tsx             # Status/type filtering View
│   ├── TaskForm.tsx                # Create-task View
│   ├── TaskList.tsx                # Task collection View
│   └── TaskStats.tsx               # Aggregate counters View
├── controllers/
│   └── useTaskController.ts        # MVC Controller and application orchestration
├── domain/
│   ├── Task.ts                     # Domain types and validation
│   └── TaskModel.ts                # Pure Model state transitions
├── patterns/
│   ├── factory/TaskFactory.ts      # Factory and concrete product creation
│   └── strategy/PriorityStrategy.ts# Strategy contract and implementations
├── repositories/
│   └── TaskRepository.ts           # Repository contract and localStorage adapter
├── tests/
│   ├── controller.test.tsx
│   ├── factory.test.ts
│   ├── model.test.ts
│   ├── repository.test.ts
│   ├── strategy.test.ts
│   ├── setup.ts
│   └── task-form.test.tsx
├── next-env.d.ts
├── next.config.js
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
docs/submission/
├── PART_A_ANALYSIS.md
├── STUDYFLOW_JUSTIFICATION.md
└── DEMO_SCRIPT.md
scripts/
└── build_submission_docs.py       # Generates the two final Word documents
```

### Task 1: Establish the project and domain contract

**Files:**
- Create: `.gitignore`
- Create: `04-studyflow/package.json`
- Create: `04-studyflow/tsconfig.json`
- Create: `04-studyflow/next.config.js`
- Create: `04-studyflow/next-env.d.ts`
- Create: `04-studyflow/vitest.config.ts`
- Create: `04-studyflow/tests/setup.ts`
- Create: `04-studyflow/domain/Task.ts`
- Test: `04-studyflow/tests/task-domain.test.ts`

**Interfaces:**
- Consumes: No application interfaces.
- Produces: `TaskKind`, `PriorityStrategyName`, `PriorityLevel`, `TaskInput`, `StudyTask`, `TaskValidationErrors`, `validateTaskInput(input, today?)`, and `toLocalDateKey(date)`.

- [ ] **Step 1: Initialize version control when execution starts**

The current workspace is not a Git repository. Run:

```powershell
git init
git switch -c feat/studyflow-prototype
```

Create `.gitignore` with:

```gitignore
**/node_modules/
**/.next/
**/coverage/
docs/submission/.qa-*/
*.log
```

- [ ] **Step 2: Add the package and TypeScript configuration**

Create `package.json` with scripts `dev`, `build`, `start`, `test`, `test:run`, and `typecheck`. Pin the instructor-compatible runtime versions and include Vitest plus Testing Library:

```json
{
  "name": "studyflow-design-patterns-prototype",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.35",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "6.6.3",
    "@testing-library/react": "16.1.0",
    "@types/node": "20.14.15",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "jsdom": "25.0.1",
    "typescript": "5.5.4",
    "vitest": "2.1.8"
  }
}
```

Use these exact configuration contracts:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"] },
});
```

```ts
// tests/setup.ts
import "@testing-library/jest-dom/vitest";
```

Export an empty object from `next.config.js`; use the standard Next.js generated references in `next-env.d.ts`.

- [ ] **Step 3: Write failing domain-validation tests**

```ts
import { describe, expect, it } from "vitest";
import { validateTaskInput } from "@/domain/Task";

const today = new Date("2026-09-21T12:00:00.000Z");

describe("validateTaskInput", () => {
  it("rejects whitespace-only title and course", () => {
    expect(validateTaskInput({
      title: "   ", course: " ", kind: "assignment",
      dueDate: "2026-09-22", effortHours: 2,
    }, today)).toMatchObject({ title: "Title is required.", course: "Course is required." });
  });

  it("rejects a due date before today", () => {
    expect(validateTaskInput({
      title: "Lab", course: "Web Development", kind: "assignment",
      dueDate: "2026-09-20", effortHours: 2,
    }, today).dueDate).toBe("Due date cannot be in the past.");
  });
});
```

- [ ] **Step 4: Run the focused test and verify red**

Run: `cd 04-studyflow && npm install && npm run test:run -- tests/task-domain.test.ts`

Expected: FAIL because `@/domain/Task` does not exist.

- [ ] **Step 5: Implement domain types and validation**

Implement the following public contract:

```ts
export type TaskKind = "assignment" | "exam" | "project";
export type PriorityStrategyName = "deadline" | "effort" | "balanced";
export type PriorityLevel = "low" | "medium" | "high" | "urgent";

export interface TaskInput {
  title: string;
  course: string;
  kind: TaskKind;
  dueDate: string;
  effortHours: number;
}

export interface StudyTask extends TaskInput {
  id: string;
  completed: boolean;
  createdAt: string;
  kindLabel: string;
  accent: string;
  priorityScore: number;
  priorityLevel: PriorityLevel;
}

export type TaskValidationErrors = Partial<Record<keyof TaskInput, string>>;

export function validateTaskInput(input: TaskInput, today = new Date()): TaskValidationErrors {
  const errors: TaskValidationErrors = {};
  if (!input.title.trim()) errors.title = "Title is required.";
  if (!input.course.trim()) errors.course = "Course is required.";
  if (!input.dueDate) errors.dueDate = "Due date is required.";
  else if (input.dueDate < toLocalDateKey(today)) errors.dueDate = "Due date cannot be in the past.";
  if (!Number.isFinite(input.effortHours) || input.effortHours < 1 || input.effortHours > 100) {
    errors.effortHours = "Effort must be between 1 and 100 hours.";
  }
  return errors;
}
```

Use local calendar components in `toLocalDateKey` rather than `toISOString()` so timezone offsets cannot shift the validation date.

- [ ] **Step 6: Run domain tests and type checking**

Run: `npm run test:run -- tests/task-domain.test.ts && npm run typecheck`

Expected: both commands PASS.

- [ ] **Step 7: Commit the project foundation**

```powershell
git add .gitignore 04-studyflow
git commit -m "feat: establish StudyFlow domain contract"
```

### Task 2: Implement the Factory pattern

**Files:**
- Create: `04-studyflow/patterns/factory/TaskFactory.ts`
- Test: `04-studyflow/tests/factory.test.ts`

**Interfaces:**
- Consumes: `TaskInput`, `StudyTask`, and `TaskKind` from `domain/Task.ts`.
- Produces: `TaskProduct`, three concrete products, `TaskFactory.create(kind, input, context)`, and `TaskCreationContext`.

- [ ] **Step 1: Write the failing Factory tests**

```ts
import { describe, expect, it } from "vitest";
import { TaskFactory } from "@/patterns/factory/TaskFactory";

const input = { title: "Patterns lab", course: "Web", kind: "assignment" as const, dueDate: "2026-09-24", effortHours: 4 };
const context = { id: "task-1", createdAt: "2026-09-21T12:00:00.000Z" };

describe("TaskFactory", () => {
  it.each([
    ["assignment", "Assignment", "indigo"],
    ["exam", "Exam", "rose"],
    ["project", "Project", "amber"],
  ] as const)("creates the %s concrete product", (kind, label, accent) => {
    const task = TaskFactory.create(kind, { ...input, kind }, context);
    expect(task).toMatchObject({ id: "task-1", kind, kindLabel: label, accent, completed: false });
  });
});
```

- [ ] **Step 2: Run the Factory tests and verify red**

Run: `npm run test:run -- tests/factory.test.ts`

Expected: FAIL because `TaskFactory` is not defined.

- [ ] **Step 3: Implement concrete products and centralized creation**

```ts
export interface TaskCreationContext { id: string; createdAt: string; }

interface TaskProduct {
  create(input: TaskInput, context: TaskCreationContext): StudyTask;
}

function buildTask(
  input: TaskInput,
  context: TaskCreationContext,
  kindLabel: string,
  accent: string,
): StudyTask {
  return {
    ...input,
    title: input.title.trim(),
    course: input.course.trim(),
    id: context.id,
    createdAt: context.createdAt,
    completed: false,
    kindLabel,
    accent,
    priorityScore: 0,
    priorityLevel: "low",
  };
}

class AssignmentProduct implements TaskProduct {
  create(input: TaskInput, context: TaskCreationContext) {
    return buildTask(input, context, "Assignment", "indigo");
  }
}

class ExamProduct implements TaskProduct {
  create(input: TaskInput, context: TaskCreationContext) {
    return buildTask(input, context, "Exam", "rose");
  }
}

class ProjectProduct implements TaskProduct {
  create(input: TaskInput, context: TaskCreationContext) {
    return buildTask(input, context, "Project", "amber");
  }
}

const products: Record<TaskKind, TaskProduct> = {
  assignment: new AssignmentProduct(),
  exam: new ExamProduct(),
  project: new ProjectProduct(),
};

export class TaskFactory {
  static create(kind: TaskKind, input: TaskInput, context: TaskCreationContext): StudyTask {
    return products[kind].create({ ...input, title: input.title.trim(), course: input.course.trim(), kind }, context);
  }
}
```

Every product initializes `priorityScore` to `0` and `priorityLevel` to `low`; Strategy owns the real calculation.

- [ ] **Step 4: Run Factory tests and the full suite**

Run: `npm run test:run -- tests/factory.test.ts && npm run test:run`

Expected: all tests PASS.

- [ ] **Step 5: Commit Factory**

```powershell
git add 04-studyflow/patterns/factory 04-studyflow/tests/factory.test.ts
git commit -m "feat: create study tasks through a factory"
```

### Task 3: Implement the Strategy pattern

**Files:**
- Create: `04-studyflow/patterns/strategy/PriorityStrategy.ts`
- Test: `04-studyflow/tests/strategy.test.ts`

**Interfaces:**
- Consumes: `StudyTask`, `PriorityLevel`, and `PriorityStrategyName`.
- Produces: `PriorityResult`, `PriorityStrategy.calculate(task, today?)`, `getPriorityStrategy(name)`, and `applyPriority(task, strategy, today?)`.

- [ ] **Step 1: Write failing tests for all three strategies and identity preservation**

```ts
describe("priority strategies", () => {
  it("deadline strategy makes a task due tomorrow urgent", () => {
    expect(applyPriority(taskDueTomorrow, getPriorityStrategy("deadline"), today).priorityLevel).toBe("urgent");
  });

  it("effort strategy gives a 12-hour task a high score", () => {
    expect(applyPriority({ ...baseTask, effortHours: 12 }, getPriorityStrategy("effort"), today).priorityLevel).toBe("high");
  });

  it("balanced strategy combines urgency and effort", () => {
    expect(applyPriority({ ...baseTask, dueDate: "2026-09-24", effortHours: 8 }, getPriorityStrategy("balanced"), today).priorityScore).toBeGreaterThan(60);
  });

  it("recalculation preserves identity and completion", () => {
    const result = applyPriority({ ...baseTask, completed: true }, getPriorityStrategy("deadline"), today);
    expect(result).toMatchObject({ id: baseTask.id, completed: true, title: baseTask.title });
  });
});
```

- [ ] **Step 2: Run strategy tests and verify red**

Run: `npm run test:run -- tests/strategy.test.ts`

Expected: FAIL because the strategy module does not exist.

- [ ] **Step 3: Implement the Strategy contract and algorithms**

```ts
export interface PriorityResult { score: number; level: PriorityLevel; }
export interface PriorityStrategy {
  readonly name: PriorityStrategyName;
  readonly label: string;
  calculate(task: StudyTask, today?: Date): PriorityResult;
}

function levelFor(score: number): PriorityLevel {
  if (score >= 85) return "urgent";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function clamp(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function localMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function daysUntil(dueDate: string, today: Date): number {
  const [year, month, day] = dueDate.split("-").map(Number);
  const due = new Date(year, month - 1, day).getTime();
  return Math.ceil((due - localMidnight(today)) / 86_400_000);
}

function deadlineScore(task: StudyTask, today: Date): number {
  const days = daysUntil(task.dueDate, today);
  if (days <= 1) return 100;
  if (days <= 3) return 85;
  if (days <= 7) return 65;
  if (days <= 14) return 40;
  return 20;
}

function effortScore(task: StudyTask): number {
  if (task.effortHours >= 16) return 90;
  if (task.effortHours >= 10) return 70;
  if (task.effortHours >= 5) return 50;
  return 25;
}

class DeadlinePriorityStrategy implements PriorityStrategy {
  readonly name = "deadline" as const;
  readonly label = "Deadline first";
  calculate(task: StudyTask, today = new Date()): PriorityResult {
    const score = clamp(deadlineScore(task, today));
    return { score, level: levelFor(score) };
  }
}

class EffortPriorityStrategy implements PriorityStrategy {
  readonly name = "effort" as const;
  readonly label = "Effort first";
  calculate(task: StudyTask): PriorityResult {
    const score = clamp(effortScore(task));
    return { score, level: levelFor(score) };
  }
}

class BalancedPriorityStrategy implements PriorityStrategy {
  readonly name = "balanced" as const;
  readonly label = "Balanced";
  calculate(task: StudyTask, today = new Date()): PriorityResult {
    const score = clamp(deadlineScore(task, today) * 0.6 + effortScore(task) * 0.4);
    return { score, level: levelFor(score) };
  }
}

const strategies: Record<PriorityStrategyName, PriorityStrategy> = {
  deadline: new DeadlinePriorityStrategy(),
  effort: new EffortPriorityStrategy(),
  balanced: new BalancedPriorityStrategy(),
};

export function getPriorityStrategy(name: PriorityStrategyName): PriorityStrategy {
  return strategies[name];
}

export function applyPriority(task: StudyTask, strategy: PriorityStrategy, today = new Date()): StudyTask {
  const result = strategy.calculate(task, today);
  return { ...task, priorityScore: result.score, priorityLevel: result.level };
}
```

Clamp scores to `0..100`; map `85+` to urgent, `65+` to high, `40+` to medium, otherwise low. Define date-difference calculations in local calendar days.

- [ ] **Step 4: Run strategy tests and type checking**

Run: `npm run test:run -- tests/strategy.test.ts && npm run typecheck`

Expected: both commands PASS.

- [ ] **Step 5: Commit Strategy**

```powershell
git add 04-studyflow/patterns/strategy 04-studyflow/tests/strategy.test.ts
git commit -m "feat: add interchangeable priority strategies"
```

### Task 4: Implement the Repository pattern

**Files:**
- Create: `04-studyflow/repositories/TaskRepository.ts`
- Test: `04-studyflow/tests/repository.test.ts`

**Interfaces:**
- Consumes: `StudyTask`.
- Produces: `TaskRepository`, `RepositoryLoadResult`, `RepositorySaveResult`, and `LocalStorageTaskRepository(storage, key?)`.

- [ ] **Step 1: Write failing Repository tests**

```ts
describe("LocalStorageTaskRepository", () => {
  it("round-trips tasks through storage", () => {
    const repository = new LocalStorageTaskRepository(localStorage, "test.tasks");
    expect(repository.save([baseTask])).toEqual({ ok: true });
    expect(repository.load()).toEqual({ tasks: [baseTask] });
  });

  it("recovers from corrupt JSON", () => {
    localStorage.setItem("test.tasks", "{broken");
    const result = new LocalStorageTaskRepository(localStorage, "test.tasks").load();
    expect(result).toEqual({ tasks: [], warning: "Saved tasks could not be read. A new list was started." });
  });

  it("reports write failures without throwing", () => {
    const storage = { getItem: () => null, setItem: () => { throw new Error("quota"); }, removeItem: () => undefined };
    expect(new LocalStorageTaskRepository(storage, "test.tasks").save([baseTask])).toEqual({
      ok: false,
      warning: "Changes are visible, but this browser could not save them.",
    });
  });
});
```

- [ ] **Step 2: Run Repository tests and verify red**

Run: `npm run test:run -- tests/repository.test.ts`

Expected: FAIL because the Repository module does not exist.

- [ ] **Step 3: Implement the Repository abstraction**

```ts
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface RepositoryLoadResult { tasks: StudyTask[]; warning?: string; }
export type RepositorySaveResult = { ok: true } | { ok: false; warning: string };

export interface TaskRepository {
  load(): RepositoryLoadResult;
  save(tasks: StudyTask[]): RepositorySaveResult;
  clear(): RepositorySaveResult;
}

export class LocalStorageTaskRepository implements TaskRepository {
  constructor(private readonly storage: StoragePort, private readonly key = "studyflow.tasks.v1") {}

  load(): RepositoryLoadResult {
    try {
      const raw = this.storage.getItem(this.key);
      if (!raw) return { tasks: [] };
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error("Stored value is not an array");
      return { tasks: parsed as StudyTask[] };
    } catch {
      return { tasks: [], warning: "Saved tasks could not be read. A new list was started." };
    }
  }

  save(tasks: StudyTask[]): RepositorySaveResult {
    try {
      this.storage.setItem(this.key, JSON.stringify(tasks));
      return { ok: true };
    } catch {
      return { ok: false, warning: "Changes are visible, but this browser could not save them." };
    }
  }

  clear(): RepositorySaveResult {
    try {
      this.storage.removeItem(this.key);
      return { ok: true };
    } catch {
      return { ok: false, warning: "The browser could not clear the saved task list." };
    }
  }
}
```

Validate that parsed content is an array before returning it. Do not throw parsing or storage exceptions into the View.

- [ ] **Step 4: Run Repository tests and full suite**

Run: `npm run test:run -- tests/repository.test.ts && npm run test:run`

Expected: all tests PASS.

- [ ] **Step 5: Commit Repository**

```powershell
git add 04-studyflow/repositories 04-studyflow/tests/repository.test.ts
git commit -m "feat: persist tasks through a repository"
```

### Task 5: Implement the MVC Model

**Files:**
- Create: `04-studyflow/domain/TaskModel.ts`
- Test: `04-studyflow/tests/model.test.ts`

**Interfaces:**
- Consumes: `StudyTask`, `TaskKind`, `PriorityStrategy`, and `applyPriority`.
- Produces: `TaskFilter`, `addTask`, `toggleTask`, `removeTask`, `reprioritizeTasks`, `filterTasks`, and `summarizeTasks`.

- [ ] **Step 1: Write failing state-transition tests**

```ts
describe("TaskModel", () => {
  it("adds without mutating the original list", () => {
    const original = [baseTask];
    const result = addTask(original, secondTask);
    expect(result).toEqual([secondTask, baseTask]);
    expect(original).toEqual([baseTask]);
  });

  it("toggles and removes by id", () => {
    expect(toggleTask([baseTask], baseTask.id)[0].completed).toBe(true);
    expect(removeTask([baseTask], baseTask.id)).toEqual([]);
  });

  it("filters by status and kind", () => {
    expect(filterTasks([baseTask, completedExam], { status: "completed", kind: "exam" })).toEqual([completedExam]);
  });

  it("reprioritizes every task without changing ids", () => {
    const result = reprioritizeTasks([baseTask, completedExam], getPriorityStrategy("deadline"), today);
    expect(result.map((task) => task.id)).toEqual([baseTask.id, completedExam.id]);
  });
});
```

- [ ] **Step 2: Run Model tests and verify red**

Run: `npm run test:run -- tests/model.test.ts`

Expected: FAIL because `TaskModel` functions do not exist.

- [ ] **Step 3: Implement pure Model operations**

```ts
export interface TaskFilter {
  status: "all" | "active" | "completed";
  kind: "all" | TaskKind;
}

export function addTask(tasks: StudyTask[], task: StudyTask): StudyTask[] { return [task, ...tasks]; }
export function toggleTask(tasks: StudyTask[], id: string): StudyTask[] {
  return tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
}
export function removeTask(tasks: StudyTask[], id: string): StudyTask[] {
  return tasks.filter((task) => task.id !== id);
}
export function reprioritizeTasks(tasks: StudyTask[], strategy: PriorityStrategy, today?: Date): StudyTask[] {
  return tasks.map((task) => applyPriority(task, strategy, today));
}
export function filterTasks(tasks: StudyTask[], filter: TaskFilter): StudyTask[] {
  return tasks.filter((task) => {
    const statusMatches = filter.status === "all"
      || (filter.status === "active" && !task.completed)
      || (filter.status === "completed" && task.completed);
    const kindMatches = filter.kind === "all" || task.kind === filter.kind;
    return statusMatches && kindMatches;
  });
}
export function summarizeTasks(tasks: StudyTask[]) {
  return {
    total: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
    urgent: tasks.filter((task) => !task.completed && task.priorityLevel === "urgent").length,
  };
}
```

- [ ] **Step 4: Run Model tests and full suite**

Run: `npm run test:run -- tests/model.test.ts && npm run test:run`

Expected: all tests PASS.

- [ ] **Step 5: Commit Model**

```powershell
git add 04-studyflow/domain/TaskModel.ts 04-studyflow/tests/model.test.ts
git commit -m "feat: add pure task model transitions"
```

### Task 6: Implement the MVC Controller

**Files:**
- Create: `04-studyflow/controllers/useTaskController.ts`
- Test: `04-studyflow/tests/controller.test.tsx`

**Interfaces:**
- Consumes: all domain functions, `TaskFactory`, Strategy accessors, and `TaskRepository`.
- Produces: `useTaskController(repository, options?)` returning tasks, visibleTasks, stats, filter, strategyName, errors, warning, and action callbacks.

- [ ] **Step 1: Write a failing controller integration test**

Use a memory repository and `renderHook`:

```tsx
it("creates, persists, reprioritizes, toggles, and removes through one controller", () => {
  const repository = new MemoryTaskRepository();
  const { result } = renderHook(() => useTaskController(repository, {
    now: () => new Date("2026-09-21T12:00:00.000Z"),
    createId: () => "task-1",
  }));

  act(() => result.current.createTask(validInput));
  expect(result.current.tasks).toHaveLength(1);
  expect(repository.saved[0].id).toBe("task-1");

  act(() => result.current.changeStrategy("effort"));
  expect(result.current.tasks[0].id).toBe("task-1");

  act(() => result.current.toggleTask("task-1"));
  expect(result.current.tasks[0].completed).toBe(true);

  act(() => result.current.deleteTask("task-1"));
  expect(result.current.tasks).toEqual([]);
});
```

Add separate assertions for validation errors and repository warnings.

- [ ] **Step 2: Run Controller tests and verify red**

Run: `npm run test:run -- tests/controller.test.tsx`

Expected: FAIL because the Controller hook does not exist.

- [ ] **Step 3: Implement controller orchestration**

```ts
export interface ControllerOptions {
  now?: () => Date;
  createId?: () => string;
}

export function useTaskController(repository: TaskRepository, options: ControllerOptions = {}) {
  const now = options.now ?? (() => new Date());
  const createId = options.createId ?? (() => crypto.randomUUID());
  const [loaded] = useState(() => repository.load());
  const [tasks, setTasks] = useState<StudyTask[]>(loaded.tasks);
  const [strategyName, setStrategyName] = useState<PriorityStrategyName>("balanced");
  const [filter, setFilter] = useState<TaskFilter>({ status: "all", kind: "all" });
  const [errors, setErrors] = useState<TaskValidationErrors>({});
  const [warning, setWarning] = useState<string | undefined>(loaded.warning);

  function commit(nextTasks: StudyTask[]) {
    setTasks(nextTasks);
    const saved = repository.save(nextTasks);
    setWarning(saved.ok ? undefined : saved.warning);
  }

  function createTask(input: TaskInput): boolean {
    const nextErrors = validateTaskInput(input, now());
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return false;
    const currentTime = now();
    const product = TaskFactory.create(input.kind, input, {
      id: createId(),
      createdAt: currentTime.toISOString(),
    });
    const prioritized = applyPriority(product, getPriorityStrategy(strategyName), currentTime);
    commit(addTask(tasks, prioritized));
    return true;
  }

  function changeStrategy(name: PriorityStrategyName) {
    setStrategyName(name);
    commit(reprioritizeTasks(tasks, getPriorityStrategy(name), now()));
  }

  function toggleById(id: string) {
    commit(toggleTask(tasks, id));
  }

  function deleteById(id: string) {
    commit(removeTask(tasks, id));
  }

  return {
    tasks,
    visibleTasks: filterTasks(tasks, filter),
    stats: summarizeTasks(tasks),
    filter,
    strategyName,
    errors,
    warning,
    createTask,
    changeStrategy,
    setFilter,
    toggleTask: toggleById,
    deleteTask: deleteById,
  };
}
```

Use `crypto.randomUUID()` as the default ID creator and `new Date()` as the default clock. Keep the repository instance stable in the composition root.

- [ ] **Step 4: Run Controller tests and type checking**

Run: `npm run test:run -- tests/controller.test.tsx && npm run typecheck`

Expected: both commands PASS.

- [ ] **Step 5: Commit Controller**

```powershell
git add 04-studyflow/controllers 04-studyflow/tests/controller.test.tsx
git commit -m "feat: coordinate StudyFlow through an MVC controller"
```

### Task 7: Build the React Views and composition root

**Files:**
- Create: `04-studyflow/components/DashboardHeader.tsx`
- Create: `04-studyflow/components/EmptyState.tsx`
- Create: `04-studyflow/components/TaskCard.tsx`
- Create: `04-studyflow/components/TaskFilters.tsx`
- Create: `04-studyflow/components/TaskForm.tsx`
- Create: `04-studyflow/components/TaskList.tsx`
- Create: `04-studyflow/components/TaskStats.tsx`
- Create: `04-studyflow/app/page.tsx`
- Create: `04-studyflow/app/layout.tsx`
- Create: `04-studyflow/app/globals.css`
- Test: `04-studyflow/tests/task-form.test.tsx`

**Interfaces:**
- Consumes: the controller return contract and domain display types.
- Produces: an accessible, responsive, fully interactive browser UI; Views emit callbacks and never import repositories or storage APIs.

- [ ] **Step 1: Write failing View boundary tests**

```tsx
it("submits normalized task input through its callback", async () => {
  const onSubmit = vi.fn();
  render(<TaskForm onSubmit={onSubmit} errors={{}} />);
  await user.type(screen.getByLabelText("Task title"), "Patterns lab");
  await user.type(screen.getByLabelText("Course"), "Full-Stack Web Development");
  await user.selectOptions(screen.getByLabelText("Task type"), "project");
  await user.type(screen.getByLabelText("Due date"), "2026-09-24");
  await user.clear(screen.getByLabelText("Estimated effort"));
  await user.type(screen.getByLabelText("Estimated effort"), "6");
  await user.click(screen.getByRole("button", { name: "Add task" }));
  expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ kind: "project", effortHours: 6 }));
});

it("renders field errors accessibly", () => {
  render(<TaskForm onSubmit={vi.fn()} errors={{ title: "Title is required." }} />);
  expect(screen.getByText("Title is required.")).toHaveAttribute("role", "alert");
});
```

- [ ] **Step 2: Run View tests and verify red**

Run: `npm run test:run -- tests/task-form.test.tsx`

Expected: FAIL because `TaskForm` does not exist.

- [ ] **Step 3: Implement presentation-only View components**

Use explicit prop contracts such as:

```ts
interface TaskFormProps {
  onSubmit(input: TaskInput): void;
  errors: TaskValidationErrors;
}

interface TaskCardProps {
  task: StudyTask;
  onToggle(id: string): void;
  onDelete(id: string): void;
}
```

Views may use local form-control state, but must not import `TaskFactory`, strategies, the Repository, or `localStorage`.

- [ ] **Step 4: Implement the composition root**

In `app/page.tsx`, create the repository once on the client, pass it to `useTaskController`, and wire controller state/actions to the Views. Show warnings in an `aria-live="polite"` region. Add sample educational copy naming the four patterns without exposing implementation jargon in form labels.

- [ ] **Step 5: Implement responsive styling**

Create a distinctive study-dashboard layout with:

- Deep navy background and warm paper panels.
- Indigo, rose, and amber type accents matching Factory products.
- A two-column desktop layout that becomes a single column below 900px.
- Visible keyboard focus, disabled, error, completed, urgent, and empty states.
- No dead navigation, decorative fake buttons, or placeholder text.

- [ ] **Step 6: Run View tests, full tests, and build**

Run: `npm run test:run -- tests/task-form.test.tsx && npm run test:run && npm run build`

Expected: all tests PASS and Next.js reports a successful production build.

- [ ] **Step 7: Commit the complete UI**

```powershell
git add 04-studyflow/app 04-studyflow/components 04-studyflow/tests/task-form.test.tsx
git commit -m "feat: deliver the StudyFlow dashboard"
```

### Task 8: Verify the prototype in a browser

**Files:**
- Modify only files whose behavior fails the checks below.

**Interfaces:**
- Consumes: the complete application.
- Produces: direct evidence that the user workflow and reload persistence function in a real browser.

- [ ] **Step 1: Start the development server**

Run: `cd 04-studyflow && npm run dev -- -p 3200`

Expected: Next.js reports `Ready` and `http://localhost:3200`.

- [ ] **Step 2: Exercise the complete browser flow**

Open the page and perform these exact actions:

1. Submit a whitespace-only title and verify `Title is required.` appears.
2. Create one Assignment, one Exam, and one Project.
3. Verify each card displays the correct Factory label/accent.
4. Change from Balanced to Deadline first and verify priorities reorder or update.
5. Filter to Projects, then return to All tasks.
6. Complete one task and verify statistics update.
7. Reload and verify all tasks and completion state remain.
8. Delete one task and reload to verify it stays deleted.

- [ ] **Step 3: Inspect browser console and responsive layout**

Expected: no runtime errors or hydration warnings at desktop width and approximately 390px mobile width; no clipped controls or horizontal scrolling.

- [ ] **Step 4: Re-run automated verification after browser fixes**

Run: `npm run test:run && npm run typecheck && npm run build`

Expected: all commands PASS.

- [ ] **Step 5: Commit verified behavior**

```powershell
git add 04-studyflow
git commit -m "fix: verify StudyFlow browser workflow"
```

### Task 9: Complete Part A analysis and project documentation

**Files:**
- Create: `docs/submission/PART_A_ANALYSIS.md`
- Create: `docs/submission/STUDYFLOW_JUSTIFICATION.md`
- Create: `docs/submission/DEMO_SCRIPT.md`
- Create: `04-studyflow/README.md`

**Interfaces:**
- Consumes: stable source line numbers from all four projects and observed runtime results.
- Produces: every written deliverable required by sections 7.1.4, 7.2.4, 7.3.4, 8, and 9 of the guide.

- [ ] **Step 1: Capture stable line references**

Run:

```powershell
rg -n "private static instance|private constructor|getInstance" 01-singleton/lib/DatabaseConnection.ts
rg -n "class .*Notifier|static create|switch|case" 02-factory/lib/notifications.ts
rg -n "export interface Task|export const TaskModel" 03-mvc/models/Task.ts
rg -n "export const TaskController" 03-mvc/controllers/TaskController.ts
rg -n "export default function" 03-mvc/components/*.tsx
rg -n "class TaskFactory|interface PriorityStrategy|class LocalStorageTaskRepository|function useTaskController" 04-studyflow
```

Record individual start lines and small, exact ranges in the documents. Do not cite comment-only lines as the implementation.

- [ ] **Step 2: Write the three Part A tables**

Answer each guide question directly. Include:

- Singleton: field line, private constructor line, conditional creation/return lines; explain a public constructor permits multiple IDs; identify StudyFlow storage/repository configuration as a plausible singleton case while noting the final prototype uses Repository instead.
- Factory: switch/case and concrete constructor lines; explain class, union type, factory case, and selector changes for WhatsApp; note that the supplied working copy already contains a student-added `guasap` variant and distinguish it from the instructor baseline.
- MVC: enumerate Model, View, Controller, and HTTP front-door files; explain direct fetch in `TaskList` would couple presentation to transport; identify StudyFlow as the student's MVC use case.
- Add a short test-evidence note: Singleton reused one `connectionId`; Factory returned each channel and a controlled 400 for invalid input; the MVC create/list flow worked, while PATCH/DELETE for a newly created in-memory task returned 404 because the dynamic route owned a separate module instance. Present this as a runtime limitation, not as an answer change.

- [ ] **Step 3: Write the project README**

Include:

- Problem statement and feature list.
- Technologies with their roles.
- Pattern table with exact file and final line references.
- Architecture/data-flow explanation.
- Exact `npm install`, `npm run dev`, `npm run test:run`, and `npm run build` commands.
- Manual verification steps and storage-reset instructions using the app UI or browser site-data controls.
- Known scope limits and no claims of deployment or remote persistence.

- [ ] **Step 4: Write the 1–2 page justification**

Use first-person student voice. Explain why Next.js, React, and TypeScript fit a small interactive coursework prototype; why Web Storage is adequate for local demonstration but not production collaboration; and why each of MVC, Factory, Strategy, and Repository solves a concrete StudyFlow problem. Avoid copying wording from the guide.

- [ ] **Step 5: Write the 5–7 minute demo script**

Use timed sections totaling about six minutes:

- 0:00–0:40 problem and technologies.
- 0:40–2:20 live create/filter/complete/reload flow.
- 2:20–4:50 exact code walkthrough of four patterns.
- 4:50–5:30 tests and build evidence.
- 5:30–6:00 design justification and closing.

Include likely follow-up answers: why Factory instead of a single conditional in the form, why Strategy is runtime-swappable, why Repository improves testability, and whether localStorage is production-ready.

- [ ] **Step 6: Verify all Markdown references**

Run a PowerShell script that parses every `path:line` reference, confirms the path exists, and confirms the referenced line number is within file length. Manually verify each cited line contains the described implementation.

- [ ] **Step 7: Commit documentation**

```powershell
git add 04-studyflow/README.md docs/submission
git commit -m "docs: complete StudyFlow coursework deliverables"
```

### Task 10: Generate and visually verify Word deliverables

**Files:**
- Create: `scripts/build_submission_docs.py`
- Create: `docs/submission/Part_A_Analysis.docx`
- Create: `docs/submission/StudyFlow_Justification.docx`

**Interfaces:**
- Consumes: final Markdown content and stable line references.
- Produces: polished Word versions of Part A and the 1–2 page justification.

- [ ] **Step 1: Implement the document generator**

Use `python-docx` with:

- Black Word `Title` style and clear opening paragraphs.
- Heading 1 and Heading 2 hierarchy.
- Three two-column analysis tables with repeated header rows.
- Consistent 0.75-inch margins, Aptos/Arial-compatible fonts, and readable spacing.
- Page numbers only if the bundled renderer preserves them reliably.
- No internal notes, draft labels, raw tool tokens, or horizontal rules under titles.

The script reads the finalized Markdown source or defines the same final content in structured data and writes both `.docx` files deterministically.

- [ ] **Step 2: Generate Word documents**

Run:

```powershell
& 'C:\Users\Bloer\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts/build_submission_docs.py
```

Expected: both DOCX files exist and are non-empty.

- [ ] **Step 3: Render both DOCX files to PNG**

Use the bundled document renderer and bundled LibreOffice runtime resolved by the Codex workspace dependencies:

```powershell
& 'C:\Users\Bloer\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\Bloer\.codex\plugins\cache\openai-primary-runtime\documents\26.915.20218\skills\documents\render_docx.py' 'docs/submission/Part_A_Analysis.docx' --output_dir 'docs/submission/.qa-part-a'
& 'C:\Users\Bloer\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\Bloer\.codex\plugins\cache\openai-primary-runtime\documents\26.915.20218\skills\documents\render_docx.py' 'docs/submission/StudyFlow_Justification.docx' --output_dir 'docs/submission/.qa-justification'
```

If the bundled runtime exposes no LibreOffice binary, open the DOCX files in Word for visual inspection and report that fallback explicitly.

- [ ] **Step 4: Inspect every rendered page**

Verify title clarity, table wrapping, margins, heading hierarchy, typography, page breaks, line references, missing glyphs, and that the justification remains within 1–2 pages. Fix the generator and regenerate until every page passes.

- [ ] **Step 5: Commit Word deliverables**

```powershell
git add scripts/build_submission_docs.py docs/submission/*.docx
git commit -m "docs: add verified Word deliverables"
```

### Task 11: Fresh-install verification and submission package

**Files:**
- Create: `StudyFlow_Design_Patterns_Submission.zip`
- Modify only files required by fresh-install failures.

**Interfaces:**
- Consumes: all source and final documents.
- Produces: a clean, reproducible submission archive.

- [ ] **Step 1: Run final verification in the working project**

Run: `cd 04-studyflow && npm run test:run && npm run typecheck && npm run build`

Expected: tests, type checking, and production build all PASS with zero application errors.

- [ ] **Step 2: Create the clean ZIP**

Include:

- `04-studyflow` source, configuration, tests, `package.json`, lockfile, and README.
- `docs/submission` Markdown and DOCX deliverables.

Exclude `.next`, `node_modules`, coverage, temporary render images, logs, and design-process documents unless the user asks to include them.

- [ ] **Step 3: Extract into a new temporary directory and verify from scratch**

Create and print a unique temporary destination, extract the archive, then run:

```powershell
$verificationRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('studyflow-verification-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $verificationRoot | Out-Host
Expand-Archive -LiteralPath '.\StudyFlow_Design_Patterns_Submission.zip' -DestinationPath $verificationRoot
Set-Location -LiteralPath (Join-Path $verificationRoot '04-studyflow')
npm install
npm run test:run
npm run typecheck
npm run build
```

Expected: dependency installation completes and every verification command PASSes.

- [ ] **Step 4: Inspect archive contents**

Run an archive listing and confirm there are no dependency folders, build caches, credentials, environment files, or temporary artifacts. Confirm all required deliverables are present.

- [ ] **Step 5: Commit the final source state**

Do not commit the ZIP if repository policy excludes generated archives. Commit any source fixes from fresh-install verification:

```powershell
git add 04-studyflow docs/submission scripts/build_submission_docs.py
git commit -m "chore: finalize StudyFlow submission"
```

If there are no source changes, record that no final commit was necessary.
