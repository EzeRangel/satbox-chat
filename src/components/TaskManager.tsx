"use client";

import useTasks from "~/hooks/useTasks";
import { TaskCard } from "./TaskCard";
import { Task } from "~/types/Task";
import wait from "~/lib/wait";

interface Props {
  tasks: Task[];
}

export default function TaskManager({ tasks }: Props) {
  const { data, setTasks } = useTasks();

  const handleStartTask = async (id: number) => {
    await wait(2);
    setTasks({ currentTaskId: id, totalSteps: tasks });
  };

  const handleCompleteTask = async (id: number) => {
    await wait(2);

    const currentTask = tasks.find((t) => t.id === id);
    const nextTaskId = currentTask?.next_task_id || null;

    if (nextTaskId) {
      setTasks({ currentTaskId: nextTaskId, totalSteps: tasks });
    } else {
      // TODO: Si es el final mostrar algo que indique que se terminaron las tareas.
    }
  };

  // No hay tareas actuales y sí hay data inicial.
  if (!data && tasks.length >= 1) {
    const task = tasks[0];

    return (
      <TaskCard
        data={task}
        onStartTask={handleStartTask}
        onCompletetask={handleCompleteTask}
      />
    );
  }

  // Hay una tareas actuales.
  if (data) {
    const task = tasks.find((t) => t.id === data.currentTaskId);

    return (
      <TaskCard
        data={task!}
        onStartTask={handleStartTask}
        onCompletetask={handleCompleteTask}
      />
    );
  }

  return null;
}
