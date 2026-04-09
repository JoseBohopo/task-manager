import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import * as service from "@/lib/tasks.service";

export default async function Home() {
  const result = service.listTasks();
  if (!result.success) {
    throw new Error(result.error.message);
  }
  const tasks = result.data;

  const count = tasks.length;

  return (
    <main id="main-content" className="mx-auto w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-[34px] font-bold tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
          Notes
        </h1>
        <p
          aria-live="polite"
          aria-atomic="true"
          className="mt-1 text-[15px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          {count === 0 ? "No tasks" : `${count} tasks`}
        </p>
      </header>

      <TaskForm />

      <section aria-label="Task list" className="mt-8">
        <TaskList tasks={tasks} />
      </section>
    </main>
  );
}