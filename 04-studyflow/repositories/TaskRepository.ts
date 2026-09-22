import type { StudyTask } from "@/domain/Task";

export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface RepositoryLoadResult {
  tasks: StudyTask[];
  warning?: string;
}

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
