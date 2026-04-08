import { randomUUID } from "node:crypto";
import type { Task, CreateTaskInput, UpdateTaskInput } from "./types";

const store = new Map<string, Task>();

export function getAllTasks(): Task[] {
  return Array.from(store.values());
}

export function getTaskById(id: string): Task | undefined {
  return store.get(id);
}

export function createTask(input: CreateTaskInput): Task {
  const task: Task = { id: randomUUID(), ...input };
  store.set(task.id, task);
  return task;
}

export function updateTask(id: string, input: UpdateTaskInput): Task | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;
  const updated: Task = { ...existing, ...input };
  store.set(id, updated);
  return updated;
}

export function deleteTask(id: string): boolean {
  return store.delete(id);
}

export function clearAll(): void {
  store.clear();
}
