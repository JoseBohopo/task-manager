"use client";

import { ChangeEvent, useState, useTransition, useId } from "react";
import { CreateTaskSchema } from "@/lib/types";
import FormMessage from "@/components/FormMessage";
import { createTaskAction } from "@/app/actions/tasks";

type FieldErrors = { title?: string[]; description?: string[] };
type Feedback   = { type: "success" | "error"; message: string };

export default function TaskForm() {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [completed,   setCompleted]   = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [feedback,    setFeedback]    = useState<Feedback | null>(null);
  const [isSubmitting, startSubmit]   = useTransition();

  const titleId      = useId();
  const titleErrorId = useId();
  const descId       = useId();
  const toggleId     = useId();
  const feedbackId   = useId();

  const resetMeta = () => { setFieldErrors({}); setFeedback(null); };

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    resetMeta();

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

    startSubmit(async () => {
      const result = await createTaskAction(parsed.data);
      if (result.success) {
        setTitle(""); setDescription(""); setCompleted(false);
        setFeedback({ type: "success", message: "Task created successfully." });
      } else {
        setFeedback({ type: "error", message: result.message });
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Create new task"
      aria-describedby={feedback ? feedbackId : undefined}
      className="flex flex-col gap-3"
    >

      {/* ── Title ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={titleId}
          className="text-[0.8125rem] font-semibold uppercase tracking-wide text-text-secondary"
        >
          Title{" "}
          <span aria-hidden="true" className="text-destructive">*</span>
          <span className="sr-only">(required)</span>
        </label>

        <input
          id={titleId}
          type="text"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            resetMeta();
            setTitle(e.target.value);
          }}
          placeholder="Enter task title"
          required
          aria-required="true"
          aria-invalid={!!fieldErrors.title}
          aria-describedby={fieldErrors.title ? titleErrorId : undefined}
          className={[
            "w-full rounded-[--radius-input] border bg-bg-secondary px-3.5 py-2.75",
            "text-[0.9375rem] text-text-primary placeholder:text-text-tertiary",
            "transition-shadow duration-150 outline-none",
            fieldErrors.title
              ? "border-destructive shadow-[0_0_0_3px_rgba(255,59,48,0.25)]"
              : "border-separator",
          ].join(" ")}
        />

        {fieldErrors.title && (
          <p
            id={titleErrorId}
            role="alert"
            aria-live="assertive"
            className="text-xs text-destructive"
          >
            {fieldErrors.title[0]}
          </p>
        )}
      </div>

      {/* ── Description ───────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={descId}
          className="text-[0.8125rem] font-semibold uppercase tracking-wide text-text-secondary"
        >
          Description{" "}
          <span className="text-xs font-normal normal-case text-text-tertiary">
            — optional
          </span>
        </label>

        <textarea
          id={descId}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes or details…"
          rows={3}
          className={[
            "w-full resize-none rounded-[--radius-input] border bg-bg-secondary px-3.5 py-2.75",
            "font-[inherit] text-[0.9375rem] leading-relaxed text-text-primary",
            "placeholder:text-text-tertiary border-separator",
            "transition-shadow duration-150 outline-none",
          ].join(" ")}
        />
      </div>

      {/* ── Toggle ────────────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-[--radius-input] border border-separator bg-bg-secondary px-4 py-3">
        <label
          htmlFor={toggleId}
          className="cursor-pointer select-none text-[0.9375rem] text-text-primary"
        >
          Mark as completed
        </label>

        <div className="relative h-7.75 w-12.75 shrink-0">
          {/* Track */}
          <span
            aria-hidden="true"
            className={[
              "absolute inset-0 rounded-full transition-colors duration-200 pointer-events-none",
              completed ? "bg-success" : "bg-bg-tertiary",
            ].join(" ")}
          />
          {/* Thumb */}
          <span
            aria-hidden="true"
            className={[
              "absolute top-0.5 h-6.75 w-6.75 rounded-full bg-white",
              "shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-[left] duration-200 pointer-events-none",
              completed ? "left-5.5" : "left-0.5",
            ].join(" ")}
          />
          <input
            id={toggleId}
            type="checkbox"
            role="switch"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            aria-checked={completed}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>
      {feedback && (
        <div
          id={feedbackId}
          role={feedback.type === "error" ? "alert" : "status"}
          aria-live={feedback.type === "error" ? "assertive" : "polite"}
          aria-atomic="true"
        >
          <FormMessage type={feedback.type} message={feedback.message} />
        </div>
      )}

      {/* ── Submit ────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
        className={[
          "mt-1 w-full rounded-[--radius-btn] py-3.25 text-base font-semibold tracking-[0.01em]",
          "transition-colors duration-150 outline-none",
          "active:scale-[0.97] transition-transform",
          isSubmitting
            ? "cursor-not-allowed bg-bg-tertiary text-text-tertiary"
            : "cursor-pointer bg-accent text-white hover:bg-accent-hover",
        ].join(" ")}
      >
        {isSubmitting ? "Creating…" : "Create Task"}
      </button>

    </form>
  );
}