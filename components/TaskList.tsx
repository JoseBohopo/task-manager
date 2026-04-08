import { Task } from "@/lib/types";
import TaskCard from "@/components/TaskCard";

type TaskListProps = {
  tasks: Task[];
};

export default function TaskList({ tasks }: Readonly<TaskListProps>) {
  if (tasks.length === 0) {
    return (
      <p className="text-sm text-gray-400">No tasks yet. Add one above.</p>
    );
  }

  return (
    <>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </>
  );
}
