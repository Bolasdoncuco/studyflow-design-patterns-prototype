"use client";

import { useState } from "react";
import type { PriorityStrategyName, StudyTask, TaskInput, TaskValidationErrors } from "@/domain/Task";
import {
  addTask,
  filterTasks,
  removeTask,
  reprioritizeTasks,
  summarizeTasks,
  toggleTask as toggleModelTask,
  type TaskFilter,
} from "@/domain/TaskModel";
import { TaskFactory } from "@/patterns/factory/TaskFactory";
import { applyPriority, getPriorityStrategy } from "@/patterns/strategy/PriorityStrategy";
import type { TaskRepository } from "@/repositories/TaskRepository";
import { validateTaskInput } from "@/domain/Task";

export interface ControllerOptions {
  now?: () => Date;
  createId?: () => string;
}

export function useTaskController(repository: TaskRepository, options: ControllerOptions = {}) {
  const now = options.now ?? (() => new Date());
  const createId = options.createId ?? (() => crypto.randomUUID());
  const [loaded] = useState(() => repository.load());
  const [tasks, setTasks] = useState<StudyTask[]>(loaded.tasks);
  const [strategyName, setStrategyName] = useState<PriorityStrategyName>("balanced");
  const [filter, setFilter] = useState<TaskFilter>({ status: "all", kind: "all" });
  const [errors, setErrors] = useState<TaskValidationErrors>({});
  const [warning, setWarning] = useState<string | undefined>(loaded.warning);

  function commit(nextTasks: StudyTask[]) {
    setTasks(nextTasks);
    const saved = repository.save(nextTasks);
    setWarning(saved.ok ? undefined : saved.warning);
  }

  function createTask(input: TaskInput): boolean {
    const nextErrors = validateTaskInput(input, now());
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return false;
    const currentTime = now();
    const product = TaskFactory.create(input.kind, input, {
      id: createId(),
      createdAt: currentTime.toISOString(),
    });
    const prioritized = applyPriority(product, getPriorityStrategy(strategyName), currentTime);
    commit(addTask(tasks, prioritized));
    return true;
  }

  function changeStrategy(name: PriorityStrategyName) {
    setStrategyName(name);
    commit(reprioritizeTasks(tasks, getPriorityStrategy(name), now()));
  }

  function toggleById(id: string) {
    commit(toggleModelTask(tasks, id));
  }

  function deleteById(id: string) {
    commit(removeTask(tasks, id));
  }

  function reload() {
    const fresh = repository.load();
    setTasks(fresh.tasks);
    setWarning(fresh.warning);
  }

  return {
    tasks,
    visibleTasks: filterTasks(tasks, filter),
    stats: summarizeTasks(tasks),
    filter,
    strategyName,
    errors,
    warning,
    createTask,
    changeStrategy,
    setFilter,
    toggleTask: toggleById,
    deleteTask: deleteById,
    reload,
  };
}
