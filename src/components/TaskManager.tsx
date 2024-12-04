"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { TaskCard } from "./TaskCard";
import { Task } from "~/types/Task";
import { Button } from "./ui/button";

interface Props {
  tasks: Task[];
}

export default function TaskManager({ tasks }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tasks.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4">
        <div className="flex items-center">
          {tasks.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                    index <= currentStep
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-muted"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < tasks.length - 1 && (
                  <div
                    className={cn(
                      "h-[2px] flex-1 mx-2",
                      index < currentStep ? "bg-primary" : "bg-muted"
                    )}
                    style={{ width: "calc(100% - 2.5rem)" }}
                  />
                )}
              </div>
              {index < tasks.length - 1 && <div className="flex-1" />}
            </div>
          ))}
        </div>
      </div>
      <TaskCard data={tasks[currentStep]} />
      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        <Button variant="secondary" onClick={handleNext}>
          {currentStep === tasks.length - 1 ? "Completar" : "Siguiente"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
