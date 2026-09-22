/**
 * FACTORY PATTERN (simplified Factory Method)
 * ------------------------------------------------------------------
 * Intent: centralize and abstract object creation so that client
 * code does NOT need to know the concrete class being instantiated —
 * it simply asks the factory for "a notifier of type X".
 * ------------------------------------------------------------------
 */

// 1. Common interface every product must satisfy.
export interface Notifier {
  readonly channel: string;
  send(to: string, message: string): { channel: string; deliveredTo: string; detail: string };
}

// 2. Concrete products: each implements the interface its own way.
class EmailNotifier implements Notifier {
  readonly channel = "email";
  send(to: string, message: string) {
    return {
      channel: this.channel,
      deliveredTo: to,
      detail: `Email sent to ${to} with subject "Notification" -> "${message}"`,
    };
  }
}

class SmsNotifier implements Notifier {
  readonly channel = "sms";
  send(to: string, message: string) {
    const truncated = message.length > 60 ? message.slice(0, 57) + "..." : message;
    return {
      channel: this.channel,
      deliveredTo: to,
      detail: `SMS sent to ${to}: "${truncated}"`,
    };
  }
}

class PushNotifier implements Notifier {
  readonly channel = "push";
  send(to: string, message: string) {
    return {
      channel: this.channel,
      deliveredTo: to,
      detail: `Push notification sent to device ${to} -> "${message}"`,
    };
  }
}

class wasapNotifier implements Notifier {
  readonly channel = "guasap";
  send(to: string, message: string) {
    return {
      channel: this.channel,
      deliveredTo: to,
      detail: `Whatsapp notification sent to device ${to} -> "${message}"`,
    };
  }
}

export type NotificationType = "email" | "sms" | "push" | "guasap";

// 3. The FACTORY: solely responsible for deciding which class to instantiate.
export class NotifierFactory {
  static create(type: NotificationType): Notifier {
    switch (type) {
      case "email":
        return new EmailNotifier();
      case "sms":
        return new SmsNotifier();
      case "push":
        return new PushNotifier();
      case "guasap":
        return new wasapNotifier();
      default:
        // TypeScript protects us at compile time, but we validate at
        // runtime too since the value may come from an HTTP request
        // (an untyped string).
        throw new Error(`Unsupported notification type: ${type}`);
    }
  }
}

/**
 * TEACHING NOTE:
 * Client code (the API route) only ever writes:
 *     NotifierFactory.create(type).send(to, message)
 * It never writes `new EmailNotifier()` directly. If a "whatsapp"
 * channel is added tomorrow, a new class plus a new `case` in the
 * factory is enough: the rest of the application stays untouched.
 */
