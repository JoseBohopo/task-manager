"use server";

import { revalidatePath } from "next/cache";
import * as service from "@/lib/tasks.service";
import { type CreateTaskInput, type Task } from "@/lib/types";

export async function createTaskAction(
  data: CreateTaskInput,
): Promise<{ success: true } | { success: false; message: string }> {
  const result = service.createTask(data);
  if (!result.success) {
    return { success: false, message: result.error.message };
  }
  revalidatePath("/");
  return { success: true };
}

export async function toggleTaskAction(task: Task): Promise<void> {
  const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";
  service.updateTask(task.id, { status: newStatus });
  revalidatePath("/");
}

export async function deleteTaskAction(id: string): Promise<void> {
  service.deleteTask(id);
  revalidatePath("/");
}
