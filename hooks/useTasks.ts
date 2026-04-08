"use client";

import { useState, useEffect, useCallback } from "react";
import { Task } from "@/lib/types";

type UseTasksReturn = {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  replaceTask: (task: Task) => void;
};

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const replaceTask = useCallback((task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  }, []);

  return { tasks, isLoading, addTask, removeTask, replaceTask };
}
