"use client";

import { useState } from "react";
import { CreateTaskSchema } from "@/lib/types";
import { useCreateTask } from "@/hooks/useCreateTask";
import FormMessage from "@/components/FormMessage";

type FieldErrors = {
  title?: string[];
  description?: string[];
};

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const { createTask, isSubmitting, feedback } = useCreateTask();

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setFieldErrors({});

    const payload = {
      title,
      description: description || undefined,
      status: completed ? "COMPLETED" : "PENDING",
    } as const;

    const parsed = CreateTaskSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    const success = await createTask(parsed.data);
    if (success) {
      setTitle("");
      setDescription("");
      setCompleted(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-blue-800"
        />
        {fieldErrors.title && (
          <p id="title-error" role="alert" className="text-xs text-red-500">
            {fieldErrors.title[0]}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
          className="resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-blue-800"
        />
      </div>

      {/* Status — checkbox is clearer than a 2-option select for a binary state */}
      <div className="flex items-center gap-2">
        <input
          id="completed"
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-blue-500"
        />
        <label htmlFor="completed" className="text-sm font-medium">
          Mark as Completed
        </label>
      </div>

      {/* Feedback */}
      {feedback && <FormMessage type={feedback.type} message={feedback.message} />}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating…" : "Create Task"}
      </button>
    </form>
  );
}
