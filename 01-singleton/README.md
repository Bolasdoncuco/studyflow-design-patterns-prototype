# Example 1 — Singleton Pattern (Next.js)

## What problem does it solve?
Guarantees that a class has a **single instance** accessible from
anywhere in the application, avoiding the creation of multiple
expensive objects (database connections, loggers, global config, caches).

## Where the pattern lives
- `lib/DatabaseConnection.ts` — private constructor + `getInstance()`.
- `app/api/singleton/route.ts` — every request asks for the instance
  via `getInstance()` instead of `new DatabaseConnection()`.
- `app/page.tsx` — UI that runs queries and shows that `connectionId`
  never changes between calls.

## How to run it
```bash
npm install
npm run dev
```
Open http://localhost:3000 and run a few queries: `connectionId`
stays the same and the `totalQueries` counter goes up, proving it's
the same in-memory object on the server.

## Real-world use cases
- Database connections / connection pools.
- Centralized application loggers.
- App configuration (feature flags, already-parsed env variables).
- In-memory caches shared across modules.

## Risks to discuss with the class
- Introduces **global state**, which makes unit testing harder.
- Can hide dependencies (a module "uses" the singleton without it
  being explicit in its signature), reducing testability.
- In real serverless environments (functions destroyed between
  invocations), "singleton per process" doesn't always persist the
  way it does on a traditional server — it's important for students
  to understand this nuance.
