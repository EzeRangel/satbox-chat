"use client";

import useTasks from "~/hooks/useTasks";

export default function CurrentStepHeader() {
  const { data } = useTasks();

  if (!data) {
    return null;
  }

  const { currentTaskId, totalSteps: tasks } = data;
  const currentTask = tasks.find((t) => t.id === currentTaskId);

  if (!currentTask) {
    return null;
  }

  const currentStep = currentTask.step_order!;
  const totalSteps = tasks.length;

  return (
    <div className="px-4 py-2 bg-muted border-b">
      <div className="text-sm text-muted-foreground">
        Tarea actual: {currentTask.name}
      </div>
      <div className="w-full bg-background rounded-full h-2 mt-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
      </div>
    </div>
  );
}
