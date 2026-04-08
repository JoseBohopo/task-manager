"use client";

import { useState } from "react";
import { Task } from "@/lib/types";

type UseToggleTaskReturn = {
  toggleTask: (task: Task) => Promise<Task | null>;
  isToggling: boolean;
};

export function useToggleTask(): UseToggleTaskReturn {
  const [isToggling, setIsToggling] = useState(false);

  async function toggleTask(task: Task): Promise<Task | null> {
    setIsToggling(true);
    try {
      const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) return null;
      return (await res.json()) as Task;
    } catch {
      return null;
    } finally {
      setIsToggling(false);
    }
  }

  return { toggleTask, isToggling };
}
