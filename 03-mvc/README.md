# Example 3 — MVC Pattern (Next.js)

## What problem does it solve?
Splits an application into three independent responsibilities:
- **Model**: data and business rules.
- **View**: presentation (what the user sees).
- **Controller**: receives user intent, validates it, and coordinates
  between the Model and the View.

This lets each layer change independently (e.g. the database, or the
visual design) without rewriting the others.

## Where the pattern lives
| Layer | File(s) |
|---|---|
| Model | `models/Task.ts` |
| Controller | `controllers/TaskController.ts` + `app/api/tasks/route.ts` + `app/api/tasks/[id]/route.ts` |
| View | `components/TaskForm.tsx`, `components/TaskList.tsx`, `app/page.tsx` |

`app/page.tsx` acts as the client-side connective tissue: it calls
the API (which is the Controller) and passes the data down to the
View components, which are "dumb" (they don't know how to fetch).

## How to run it
```bash
npm install
npm run dev
```
Add tasks, mark them complete, and delete them. Each action travels:
View -> fetch -> API route -> Controller -> Model -> response -> View
re-renders.

## Real-world use cases
- Practically any CRUD web application (blogs, e-commerce, admin
  systems).
- Frameworks like Laravel, Ruby on Rails, ASP.NET MVC, and Django
  (with variants) are built around this separation.
- Next.js doesn't enforce MVC natively, but organizing `app/api` as
  "thin controllers" that delegate to domain modules (as done here)
  is common practice in real projects.

## Key difference from Singleton and Factory
Singleton and Factory are **creational patterns** (they solve *how*
and *how many* objects get created). MVC is an **architectural
pattern**: it organizes the whole application into layers with
distinct responsibilities. In fact, it's common inside an MVC app to
use Singleton (e.g. a single shared DB connection used by the Model)
and Factory (e.g. creating different kinds of "repositories"
depending on the environment).
