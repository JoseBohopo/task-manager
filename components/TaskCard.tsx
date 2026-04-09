"use client";

import { useId, useState, useTransition } from "react";
import { Task } from "@/lib/types";
import {
  toggleTaskAction,
  deleteTaskAction,
} from "@/app/actions/tasks";
import FormMessage from "@/components/FormMessage";

type TaskCardProps = { task: Task };

export default function TaskCard({ task }: Readonly<TaskCardProps>) {
  const id = useId();

  const [isToggling, startToggle] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isCompleted = task.status === "COMPLETED";
  const isBusy = isToggling || isDeleting;

  const statusId = `${id}-status`;

  function handleToggle() {
    setError(null);
    startToggle(async () => {
      const result = await toggleTaskAction(task);
      if (!result.success) setError(result.message);
    });
  }

  function handleDelete() {
    setError(null);
    startDelete(async () => {
      const result = await deleteTaskAction(task.id);
      if (!result.success) setError(result.message);
    });
  }

  return (
    <div
      className="
        flex flex-col h-full
        rounded-(--radius-card)
        bg-bg-secondary
        shadow-(--shadow-card)
        transition hover:shadow-(--shadow-card-hover)
      "
      aria-describedby={statusId}
    >
      {/* CONTENT */}
      <div
        className={`
          flex items-center gap-3 px-4 py-3 transition-opacity
          ${isCompleted ? "opacity-60" : ""}
        `}
      >
        <button
          type="button"
          role="switch"
          aria-checked={isCompleted}
          aria-label={`Mark "${task.title}" as ${isCompleted ? "pending" : "completed"}`}
          onClick={handleToggle}
          disabled={isBusy}
          className={[
            "relative h-7.75 w-12.75 shrink-0 rounded-full",
            "transition-colors duration-200 outline-none",
            "focus-visible:shadow-(--focus-ring)",
            isCompleted ? "bg-success" : "bg-bg-tertiary",
            isBusy ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-0.5 h-6.75 w-6.75 rounded-full bg-white",
              "shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-[left] duration-200",
              isCompleted ? "left-5.5" : "left-0.5",
            ].join(" ")}
          />
        </button>

        {/* TEXT */}
        <div className="min-w-0 flex-1">
          <p
            className={`
              text-[0.9375rem] font-semibold leading-snug
              ${
                isCompleted
                  ? "line-through text-text-tertiary"
                  : "text-text-primary"
              }
            `}
          >
            {task.title}
          </p>

          {task.description && (
            <p
              className={`
                mt-0.5 text-[0.8125rem] leading-snug
                ${
                  isCompleted
                    ? "line-through text-text-tertiary"
                    : "text-text-secondary"
                }
              `}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* DELETE */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isBusy}
          aria-label={`Delete "${task.title}"`}
          className={`
            ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full
            text-destructive transition-colors outline-none
            hover:bg-bg-tertiary
            focus-visible:shadow-(--focus-ring)
            ${isBusy ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>

      {/* ERROR / STATUS */}
      {error && (
        <div
          id={statusId}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="px-4 pb-3"
        >
          <FormMessage type="error" message={error} />
        </div>
      )}
    </div>
  );
}