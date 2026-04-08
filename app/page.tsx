"use client";

import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";
import { useTasks } from "@/hooks/useTasks";

export default function Home() {
  const { tasks, isLoading, addTask, removeTask, replaceTask } = useTasks();

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Task Manager</h1>
      <TaskForm onCreated={addTask} />
      <section className="mt-8 flex flex-col gap-3">
        {isLoading && (
          <p className="text-sm text-gray-400">Loading tasks...</p>
        )}
        {!isLoading && tasks.length === 0 && (
          <p className="text-sm text-gray-400">No tasks yet. Add one above.</p>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={replaceTask}
            onDelete={removeTask}
          />
        ))}
      </section>
    </main>
  );
}