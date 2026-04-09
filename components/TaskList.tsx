import { Task } from "@/lib/types";
import TaskCard from "@/components/TaskCard";

type TaskListProps = { tasks: Task[] };

export default function TaskList({ tasks }: Readonly<TaskListProps>) {
  if (tasks.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-3 py-12"
        role="status"
        aria-label="No tasks"
      >
        <svg
          aria-hidden="true"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-tertiary"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="13" y2="17" />
        </svg>

        <p className="text-[0.9375rem] text-text-tertiary">
          No tasks yet. Add one above.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="
        flex flex-wrap gap-4
        rounded-(--radius-card)
        p-4
      "
    >
      {tasks.map((task) => (
        <li
          key={task.id}
          className="
            w-full
            sm:w-[calc(50%-0.5rem)]
            lg:w-[calc(33.333%-0.75rem)]
          "
        >
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  );
}