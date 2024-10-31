"use client";

import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Task } from "~/types/Task";
import { Accordion, AccordionContent, AccordionItem } from "./ui/accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { DocumentList } from "./DocumentList";

interface Props {
  data: Task;
  onStartTask: (id: number) => Promise<void>;
  onCompletetask?: (id: number) => Promise<void>;
}

type TaskStatus = "idle" | "started" | "completed";

export function TaskCard({ data, onStartTask, onCompletetask }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TaskStatus>("idle");

  const {
    name,
    description,
    guide_url: guideUrl,
    task_type: taskType,
    step_order: order,
    required_docs: requiredDocs,
  } = data;

  const hasDocs = requiredDocs && requiredDocs.length >= 1;

  const handleStartTask = async (id: number) => {
    setLoading(true);

    await onStartTask(id);

    setLoading(false);
    setStatus("started");
  };

  const handleCompleteTask = async () => {
    setLoading(true);

    await onCompletetask?.(data.id);
    setLoading(false);
    setStatus("completed");
  };

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
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="flex items-start gap-2">
                <ChevronDown className="w-5 h-5" />
                <strong>Más información</strong>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 p-4">
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
                {taskType ? (
                  <p>
                    <strong>Dónde hacerlo: </strong>
                    <span>
                      {taskType === "ONLINE" ? "En línea" : "Presencial"}
                    </span>
                  </p>
                ) : null}
                {!hasDocs ? null : (
                  <div>
                    <p className="mb-3">
                      <strong>Qué necesitas</strong>
                    </p>
                    <DocumentList documents={requiredDocs!} />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter>
        {status === "started" ? (
          <div className="w-full flex flex-col gap-2">
            {data?.action_url ? (
              <Link
                href={data.action_url}
                target="_blank"
                className={buttonVariants({ variant: "secondary" })}
              >
                Ir al sitio del SAT
                <ExternalLink className="w-4 h-4 ml-3" />
              </Link>
            ) : null}
            <Button variant="default" onClick={handleCompleteTask}>
              Completar tarea
            </Button>
          </div>
        ) : (
          <Button
            disabled={loading}
            className="w-full"
            onClick={() => {
              handleStartTask(data.id);
            }}
            variant="default"
          >
            {loading ? "Preparando todo..." : "Iniciar tarea"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
