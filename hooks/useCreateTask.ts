"use client";

import { useState } from "react";
import { CreateTaskInput } from "@/lib/types";

type Feedback = { type: "success" | "error"; message: string };

type UseCreateTaskReturn = {
  createTask: (data: CreateTaskInput) => Promise<boolean>;
  isSubmitting: boolean;
  feedback: Feedback | null;
  clearFeedback: () => void;
};

export function useCreateTask(): UseCreateTaskReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function createTask(data: CreateTaskInput): Promise<boolean> {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 201) {
        setFeedback({ type: "success", message: "Task created successfully." });
        return true;
      }

      const body = await res.json().catch(() => null);
      const message = body?.error?.message ?? `Unexpected error (${res.status})`;
      setFeedback({ type: "error", message });
      return false;
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { createTask, isSubmitting, feedback, clearFeedback: () => setFeedback(null) };
}
