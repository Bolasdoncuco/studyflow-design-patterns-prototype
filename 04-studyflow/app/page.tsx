"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import TaskFilters from "@/components/TaskFilters";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";
import { useTaskController } from "@/controllers/useTaskController";
import { LocalStorageTaskRepository, type StoragePort } from "@/repositories/TaskRepository";

const memoryStorage: StoragePort = { getItem: () => null, setItem: () => undefined, removeItem: () => undefined };

export default function Home() {
  const repository = useMemo(() => new LocalStorageTaskRepository(typeof window === "undefined" ? memoryStorage : window.localStorage), []);
  const controller = useTaskController(repository);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => { if (mounted) controller.reload(); }, [mounted]);

  return <main className="shell"><DashboardHeader strategyName={controller.strategyName} onStrategyChange={controller.changeStrategy} /><div className="dashboard-grid"><section className="left-column"><TaskForm onSubmit={controller.createTask} errors={controller.errors} /><div className="pattern-note"><span className="note-icon">◎</span><p><strong>Pattern map</strong> Factory creates the task, Strategy ranks it, Repository saves it, and MVC keeps each responsibility clear.</p></div></section><section className="right-column"><TaskStats stats={controller.stats} /><div className="list-heading"><div><p className="eyebrow">YOUR WORKLOAD / {controller.stats.total} TOTAL</p><h2>Task board</h2></div><TaskFilters filter={controller.filter} onChange={controller.setFilter} /></div>{controller.warning && <p className="warning" role="status">{controller.warning}</p>}<TaskList tasks={controller.visibleTasks} onToggle={controller.toggleTask} onDelete={controller.deleteTask} /></section></div><footer><span>Built with Next.js · React · TypeScript</span><span>Local-first prototype · {mounted ? "Saved in this browser" : "Loading your plan"}</span></footer></main>;
}
