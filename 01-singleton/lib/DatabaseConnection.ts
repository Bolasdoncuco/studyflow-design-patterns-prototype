/**
 * SINGLETON PATTERN
 * ------------------------------------------------------------------
 * Intent: guarantee that a class has a SINGLE instance across the
 * whole application and provide a global access point to it.
 *
 * This example simulates a database connection "pool". Opening a
 * connection is an expensive operation (time + resources), so we
 * don't want to create a new one on every request. The class
 * controls its own instantiation: the constructor is private and
 * only the static method `getInstance()` can hand out the shared
 * reference.
 * ------------------------------------------------------------------
 */

export class DatabaseConnection {
  // 1. The single instance lives in a private static field.
  private static instance: DatabaseConnection;

  // 2. Internal (simulated) connection state.
  public readonly connectionId: string;
  public readonly createdAt: string;
  private queryCount: number = 0;

  // 3. PRIVATE constructor: nobody outside the class can call `new`.
  private constructor() {
    this.connectionId = `conn_${Math.random().toString(36).slice(2, 10)}`;
    this.createdAt = new Date().toISOString();
    console.log(`[Singleton] New connection created -> ${this.connectionId}`);
  }

  // 4. Global, controlled access point.
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  // 5. A "business" method that uses the shared state.
  public runQuery(query: string): { connectionId: string; queryNumber: number; query: string } {
    this.queryCount += 1;
    return {
      connectionId: this.connectionId,
      queryNumber: this.queryCount,
      query,
    };
  }

  public getStats() {
    return {
      connectionId: this.connectionId,
      createdAt: this.createdAt,
      totalQueries: this.queryCount,
    };
  }
}

/**
 * TEACHING NOTE:
 * In Next.js (a serverless / hot-reload dev environment), what this
 * example demonstrates is "single per Node process": every request
 * to the server that calls `DatabaseConnection.getInstance()` reuses
 * the SAME instance as long as the process stays alive. It's the
 * clearest way to observe the pattern without relying on external
 * infrastructure.
 */
