"use client";

import { useState } from "react";

type UseDeleteTaskReturn = {
  deleteTask: (id: string) => Promise<boolean>;
  isDeleting: boolean;
};

export function useDeleteTask(): UseDeleteTaskReturn {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteTask(id: string): Promise<boolean> {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      return res.status === 204;
    } catch {
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  return { deleteTask, isDeleting };
}
