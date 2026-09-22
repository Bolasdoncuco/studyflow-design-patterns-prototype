import type { TaskFilter } from "@/domain/TaskModel";
import type { TaskKind } from "@/domain/Task";

export default function TaskFilters({ filter, onChange }: { filter: TaskFilter; onChange(filter: TaskFilter): void }) {
  return <div className="filters" aria-label="Task filters"><label>Status<select aria-label="Status filter" value={filter.status} onChange={(event) => onChange({ ...filter, status: event.target.value as TaskFilter["status"] })}><option value="all">All status</option><option value="active">Active</option><option value="completed">Completed</option></select></label><label>Type<select aria-label="Type filter" value={filter.kind} onChange={(event) => onChange({ ...filter, kind: event.target.value as TaskKind | "all" })}><option value="all">All types</option><option value="assignment">Assignments</option><option value="exam">Exams</option><option value="project">Projects</option></select></label></div>;
}
