"use client";

import { Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useChat } from "ai/react";
import ChatList from "./ChatList";

const predefinedQuestions = [
  "Pre-inscripción en el RFC",
  "Inscripción en el RFC",
  "Generar contraseña del SAT",
  "Generar e.firma",
];

export function ChatAssistant() {
  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat({
      api: "/api/chat",
    });

  return (
    <div className="w-full h-screen md:h-[calc(100vh-32px)] bg-background border rounded-lg overflow-hidden flex flex-col shadow-lg animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 border-b flex justify-between items-center bg-muted">
        <h2 className="font-semibold">Chat Assistant</h2>
      </div>
      <ChatList isLoading={isLoading} messages={messages} />
      <div className="p-4 border-t">
        <ScrollArea className="w-full whitespace-nowrap mb-4">
          <div className="flex space-x-2">
            {predefinedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs py-1 px-2 h-auto"
                onClick={() => {}}
              >
                {question}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe tu mensaje..."
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
