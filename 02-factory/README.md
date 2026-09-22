# Example 2 — Factory Pattern (Next.js)

## What problem does it solve?
Centralizes and abstracts **object creation** when several classes
share a common interface, so client code isn't full of `if/else` or
`switch` statements deciding which class to instantiate with `new`.

## Where the pattern lives
- `lib/notifications.ts` — the `Notifier` interface, three concrete
  products (`EmailNotifier`, `SmsNotifier`, `PushNotifier`), and the
  `NotifierFactory` class with its static `create()` method.
- `app/api/factory/route.ts` — the client only calls
  `NotifierFactory.create(type)`, never instantiates directly.
- `app/page.tsx` — UI that lets you pick a channel (email/SMS/push)
  and send a simulated notification.

## How to run it
```bash
npm install
npm run dev
```

## Real-world use cases
- Multi-channel notification systems (email, SMS, push, WhatsApp).
- Connectors to different payment gateways.
- Parsers/serializers depending on file format (JSON, XML, CSV).
- Database drivers depending on the configured engine.

## Key difference from Singleton
Factory is concerned with **how** objects get created (it can create
many different instances); Singleton is concerned with **how many**
instances exist (it guarantees there's only one). They're orthogonal
— in fact, a factory can internally use a singleton to cache
expensive instances.
