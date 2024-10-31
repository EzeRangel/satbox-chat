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
import { Accordion, AccordionContent, AccordionItem } from "./ui/accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

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
        <Button
          variant="secondary"
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
