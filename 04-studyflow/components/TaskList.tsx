import type { StudyTask } from "@/domain/Task";
import TaskCard from "@/components/TaskCard";
import EmptyState from "@/components/EmptyState";

export default function TaskList({ tasks, onToggle, onDelete }: { tasks: StudyTask[]; onToggle(id: string): void; onDelete(id: string): void }) {
  if (tasks.length === 0) return <EmptyState />;
  return <div className="task-list">{tasks.map((task) => <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />)}</div>;
}
