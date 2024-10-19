"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tables } from "~/types/database.types";

type Task = Tables<"tasks">;

interface Props extends Task {
  onComplete: () => void;
}

export function TaskCard({
  name,
  description,
  step_order: order,
  onComplete,
}: Props) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-start gap-2">
          <span className="text-primary">💡</span>
          Paso {order}: {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <span className="text-primary mt-1">🔍</span>
          <p>
            <span className="font-semibold">Descripción: </span>
            {description}
          </p>
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onComplete} className="w-full">
          Complete
        </Button>
      </CardFooter>
    </Card>
  );
}
