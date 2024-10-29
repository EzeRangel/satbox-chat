"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Task } from "~/types/Task";

interface Props {
  data: Task;
  onStartTask: (id: number) => void;
  onCompletetask?: (id: number) => void;
}

export function TaskCard({ data, onStartTask }: Props) {
  const {
    name,
    description,
    guide_url: guideUrl,
    task_type: taskType,
    step_order: order,
    required_docs: requiredDocs,
  } = data;

  const hasDocs = requiredDocs && requiredDocs.length >= 1;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-start gap-2">
          <span className="text-primary">💡</span>
          Paso {order}: {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <span className="text-primary mt-1">🔍</span>
            <p>
              <span className="font-semibold">Descripción: </span>
              {description}
            </p>
          </div>
          <div className="flex items-start gap-2">
            {guideUrl ? (
              <p>
                <strong>Guía Oficial: </strong>
                <a
                  href={guideUrl}
                  target="_blank"
                  className="underline text-blue-500"
                >
                  Guía Oficial del SAT
                </a>
              </p>
            ) : null}
          </div>
          <div className="flex items-start gap-2">
            {taskType ? (
              <p>
                <strong>Dónde hacerlo: </strong>
                <span>{taskType === "ONLINE" ? "En línea" : "Presencial"}</span>
              </p>
            ) : null}
          </div>
          <div className="flex items-start gap-2">
            {!hasDocs ? (
              <p>
                <strong>Documentación: </strong>
                <span>Ninguna</span>
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            onStartTask(data.id);
          }}
        >
          Iniciar tarea
        </Button>
      </CardFooter>
    </Card>
  );
}
