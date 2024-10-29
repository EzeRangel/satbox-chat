import { useSessionStorage } from "usehooks-ts";
import { Task } from "~/types/Task";

interface Tasks {
  currentTaskId: number;
  totalSteps: Task[];
}

export default function useTasks() {
  const [data, setTasks, removeTasks] = useSessionStorage<Tasks | null>(
    "tasks",
    null
  );

  return {
    data,
    setTasks,
    removeTasks,
  };
}
