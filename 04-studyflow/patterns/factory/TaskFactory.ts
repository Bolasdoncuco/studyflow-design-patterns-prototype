import type { StudyTask, TaskInput, TaskKind } from "@/domain/Task";

export interface TaskCreationContext {
  id: string;
  createdAt: string;
}

export interface TaskProduct {
  create(input: TaskInput, context: TaskCreationContext): StudyTask;
}

function buildTask(
  input: TaskInput,
  context: TaskCreationContext,
  kindLabel: string,
  accent: string,
): StudyTask {
  return {
    ...input,
    title: input.title.trim(),
    course: input.course.trim(),
    id: context.id,
    createdAt: context.createdAt,
    completed: false,
    kindLabel,
    accent,
    priorityScore: 0,
    priorityLevel: "low",
  };
}

class AssignmentProduct implements TaskProduct {
  create(input: TaskInput, context: TaskCreationContext) {
    return buildTask(input, context, "Assignment", "indigo");
  }
}

class ExamProduct implements TaskProduct {
  create(input: TaskInput, context: TaskCreationContext) {
    return buildTask(input, context, "Exam", "rose");
  }
}

class ProjectProduct implements TaskProduct {
  create(input: TaskInput, context: TaskCreationContext) {
    return buildTask(input, context, "Project", "amber");
  }
}

const products: Record<TaskKind, TaskProduct> = {
  assignment: new AssignmentProduct(),
  exam: new ExamProduct(),
  project: new ProjectProduct(),
};

export class TaskFactory {
  static create(kind: TaskKind, input: TaskInput, context: TaskCreationContext): StudyTask {
    return products[kind].create({ ...input, kind }, context);
  }
}
