import {
  CreateTaskSchema,
  UpdateTaskSchema,
  type Task,
  type ServiceResult,
} from "./types";
import * as store from "./store";

export function listTasks(): ServiceResult<Task[]> {
  return { success: true, data: store.getAllTasks() };
}

export function getTask(id: string): ServiceResult<Task> {
  const task = store.getTaskById(id);
  if (!task) {
    return { success: false, error: { code: "NOT_FOUND", message: `Task ${id} not found` } };
  }
  return { success: true, data: task };
}

export function createTask(input: unknown): ServiceResult<Task> {
  const parsed = CreateTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } };
  }
  const task = store.createTask(parsed.data);
  return { success: true, data: task };
}

export function updateTask(id: string, input: unknown): ServiceResult<Task> {
  const existing = store.getTaskById(id);
  if (!existing) {
    return { success: false, error: { code: "NOT_FOUND", message: `Task ${id} not found` } };
  }
  const parsed = UpdateTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } };
  }
  const updated = store.updateTask(id, parsed.data);
  return { success: true, data: updated! };
}

export function deleteTask(id: string): ServiceResult<true> {
  const existing = store.getTaskById(id);
  if (!existing) {
    return { success: false, error: { code: "NOT_FOUND", message: `Task ${id} not found` } };
  }
  store.deleteTask(id);
  return { success: true, data: true };
}
