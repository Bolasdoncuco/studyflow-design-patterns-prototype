# Part A — Analysis of the Instructor Examples

The three instructor prototypes were installed and run locally with `npm install` and `npm run dev`. Their behavior was checked through the browser and their source was read to identify the pattern structure.

## Singleton (§7.1.4)

| Question | Answer | Evidence |
|---|---|---|
| Where is the only instance controlled? | `DatabaseConnection` stores the single instance in a private static field. `getInstance()` creates it only when the field is empty and returns the same object afterward. | `01-singleton/lib/DatabaseConnection.ts:18, 33-37` |
| What would change if the constructor were public? | Any caller could create another connection with `new DatabaseConnection()`, so the class could no longer guarantee one shared connection. | `01-singleton/lib/DatabaseConnection.ts:26` makes the constructor private. |
| Where could I use this in my own project? | A single client for a browser cache, analytics queue, or configuration registry is a reasonable use when all callers must share one resource. In StudyFlow I used a Repository abstraction instead because the storage dependency should remain replaceable and testable. | `04-studyflow/repositories/TaskRepository.ts:16-56` |

## Factory (§7.2.4)

| Question | Answer | Evidence |
|---|---|---|
| Where is the concrete class selected? | The `NotifierFactory.create()` switch selects Email, SMS, Push, or Wasap based on the requested channel. The caller asks for a notifier without constructing a concrete class. | `02-factory/lib/notifications.ts:65-80`; caller `02-factory/app/api/factory/route.ts:14` |
| What would I change to add WhatsApp? | Add a WhatsApp product implementing `Notifier`, add a `guasap`/WhatsApp case to the factory switch, and add a route or request value that selects it. The instructor prototype already demonstrates this extension. | `02-factory/lib/notifications.ts:51-62, 68-75` |
| Where could I use this in my own project? | A notification service, payment provider, export format, or task type can hide variant construction behind one stable API. StudyFlow uses the same idea for Assignment, Exam, and Project products. | `04-studyflow/patterns/factory/TaskFactory.ts:32-60` |

## MVC (§7.3.4)

| Question | Answer | Evidence |
|---|---|---|
| Which files are Model, View, and Controller? | Model: `models/Task.ts`; View: `components/TaskForm.tsx` and `components/TaskList.tsx`; Controller: `controllers/TaskController.ts`. API routes connect HTTP requests to the controller. | `03-mvc/models/Task.ts:12-38`; `03-mvc/components/TaskForm.tsx`; `03-mvc/components/TaskList.tsx`; `03-mvc/controllers/TaskController.ts:15-44` |
| What happens if the View calls `fetch` directly? | Rendering becomes coupled to transport details, validation and error handling get duplicated, and the View becomes harder to test or reuse. The controller boundary keeps those concerns in one place. | `03-mvc/app/api/tasks/route.ts:5-16` delegates to the controller instead of putting task rules in the component. |
| Where could I use MVC in my own project? | A dashboard or CRUD application benefits from a View for rendering, a Controller for use-case coordination, and a Model for domain rules. StudyFlow applies this as a React View, `useTaskController`, and immutable task model. | `04-studyflow/app/page.tsx:15-21`; `04-studyflow/controllers/useTaskController.ts:24-83`; `04-studyflow/domain/TaskModel.ts:10-41` |

## Runtime observations

- Singleton returned the same `connectionId` for three requests while its query counter increased.
- Factory successfully returned Email, SMS, Push, and Wasap responses; an unknown channel returned a controlled 400 response.
- MVC loaded and created tasks successfully. In the instructor sample, a newly created task could not be updated or deleted across separate dynamic route requests because the in-memory store is module-local; this is a useful reminder that a production MVC application needs durable shared persistence.
