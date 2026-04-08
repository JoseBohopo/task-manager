"use client";

import { useState } from "react";
import { CreateTaskInput, Task } from "@/lib/types";

type Feedback = { type: "success" | "error"; message: string };

type UseCreateTaskReturn = {
  createTask: (data: CreateTaskInput) => Promise<Task | null>;
  isSubmitting: boolean;
  feedback: Feedback | null;
  clearFeedback: () => void;
};

export function useCreateTask(): UseCreateTaskReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function createTask(data: CreateTaskInput): Promise<Task | null> {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 201) {
        const task = (await res.json()) as Task;
        return task;
      }

      const body = await res.json().catch(() => null);
      const message = body?.error?.message ?? `Unexpected error (${res.status})`;
      setFeedback({ type: "error", message });
      return null;
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { createTask, isSubmitting, feedback, clearFeedback: () => setFeedback(null) };
}
