"use client";

import useTasks from "~/hooks/useTasks";
import { TaskCard } from "./TaskCard";
import { Task } from "~/types/Task";

interface Props {
  tasks: Task[];
}

export default function TaskManager({ tasks }: Props) {
  const { setTasks } = useTasks();

  const handleStartTask = (id: number) => {
    setTasks({ currentTaskId: id, totalSteps: tasks });
  };

  if (tasks.length >= 1) {
    const task = tasks[0];

    return <TaskCard data={task} onStartTask={handleStartTask} />;
  }

  return null;
}
