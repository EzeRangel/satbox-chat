"use client";

import { Message } from "ai";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import UserMessage from "./Message";

interface Props {
  messages: Message[];
  isLoading?: boolean;
}

export default function ChatList({ messages, isLoading = false }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ScrollArea className="flex-grow p-4">
      {messages.map((message) => {
        return <UserMessage key={message.id} {...message} />;
      })}
      {isLoading && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Escribiendo...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}
