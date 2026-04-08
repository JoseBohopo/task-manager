"use client";

import { useTransition } from "react";
import { Task } from "@/lib/types";
import { toggleTaskAction, deleteTaskAction } from "@/app/actions/tasks";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: Readonly<TaskCardProps>) {
  const [isToggling, startToggle] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const isCompleted = task.status === "COMPLETED";
  const isBusy = isToggling || isDeleting;

  function handleToggle() {
    startToggle(() => toggleTaskAction(task));
  }

  function handleDelete() {
    startDelete(() => deleteTaskAction(task.id));
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${
        isCompleted
          ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
          : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"
      }`}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleToggle}
        disabled={isBusy}
        className={`mt-0.5 h-4 w-4 cursor-pointer accent-blue-600 disabled:cursor-not-allowed ${isCompleted ? "opacity-40" : ""}`}
        aria-label={`Mark "${task.title}" as ${isCompleted ? "pending" : "completed"}`}
      />

      <div className={`min-w-0 flex-1 ${isCompleted ? "opacity-40" : ""}`}>
        <p
          className={`text-sm font-medium ${
            isCompleted
              ? "text-gray-400 line-through dark:text-gray-500"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            className={`mt-0.5 text-xs ${
              isCompleted
                ? "text-gray-300 line-through dark:text-gray-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      <button
        onClick={handleDelete}
        disabled={isBusy}
        aria-label={`Delete "${task.title}"`}
        className="ml-auto shrink-0 rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-900/20 dark:hover:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  );
}
