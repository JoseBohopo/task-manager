import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import * as service from "@/lib/tasks.service";

export default function Home() {
  const result = service.listTasks();
  const tasks = result.success ? result.data : [];

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Task Manager</h1>
      <TaskForm />
      <section className="mt-8 flex flex-col gap-3">
        <TaskList tasks={tasks} />
      </section>
    </main>
  );
}