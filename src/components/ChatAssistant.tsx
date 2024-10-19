"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, X, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useChat } from "ai/react";
import { ToolInvocation } from "ai";
import { TaskCard } from "./TaskCard";

const predefinedQuestions = [
  "Pre-inscripción en el RFC",
  "Inscripción en el RFC",
  "Generar contraseña del SAT",
  "Generar e.firma",
];

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chatOpen") === "true";
    }
    return false;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat({
      api: "/api/chat",
    });

  useEffect(() => {
    localStorage.setItem("chatOpen", isOpen.toString());
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      ) : (
        <div className="w-full sm:w-96 h-[500px] bg-background border rounded-lg overflow-hidden flex flex-col shadow-lg animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 border-b flex justify-between items-center bg-muted">
            <h2 className="font-semibold">Chat Assistant</h2>
            <Button
              onClick={() => setIsOpen(false)}
              size="icon"
              variant="ghost"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close chat</span>
            </Button>
          </div>
          <ScrollArea className="flex-grow p-4">
            {messages.map((message) => {
              return (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                    {message.toolInvocations?.map(
                      (toolInvocation: ToolInvocation) => {
                        const toolCallId = toolInvocation.toolCallId;

                        if (toolInvocation.toolName === "tasks") {
                          return (
                            <div key={toolCallId}>
                              {"result" in toolInvocation ? (
                                <TaskCard {...toolInvocation.result.tasks} />
                              ) : (
                                <span>{toolInvocation.args.message}</span>
                              )}
                            </div>
                          );
                        }

                        return null;
                      }
                    )}
                    {message?.createdAt ? (
                      <div className="text-xs mt-1 opacity-50">
                        {formatTimestamp(
                          message.createdAt?.getUTCMilliseconds()
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Escribiendo...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
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
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
