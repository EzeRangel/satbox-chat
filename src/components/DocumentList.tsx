"use client";

import { Check, FileText, AlertCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { TaskDocument } from "~/types/database.types";

interface Props {
  documents: TaskDocument[];
}

export function DocumentList({ documents }: Props) {
  return (
    <ul className="space-y-3">
      {documents.map((doc, index) => (
        <li
          key={index}
          className="flex items-start space-x-3 p-3 bg-muted rounded-lg transition-all hover:bg-muted/80"
        >
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
              doc.mandatory
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {["PDF", "Documento"].includes(doc.type) ? (
              <FileText className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-medium leading-none">{doc.name}</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              {doc.type}
              {doc.context && ` • ${doc.context}`}
            </p>
          </div>
          {doc.mandatory && (
            <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              Obligatorio
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
