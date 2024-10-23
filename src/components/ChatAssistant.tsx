"use client";

import { BotMessageSquare, Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useChat } from "ai/react";
import ChatList from "./ChatList";
import { useEffect, useState } from "react";
import Start from "./Start";

export function ChatAssistant() {
  const [isNewChat, setNewChat] = useState(true);
  const {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    if (isLoading && isNewChat) {
      setNewChat(false);
    }
  }, [isLoading, isNewChat]);

  const handleConversationStarter = async (message: string) => {
    await append({ id: "1", role: "user", content: message });
  };

  return (
    <div className="w-full h-screen md:h-[calc(100vh-32px)] bg-background border rounded-lg overflow-hidden flex flex-col shadow-lg animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 border-b flex items-center bg-muted gap-2">
        <BotMessageSquare />
        <h2 className="font-semibold">SATBot</h2>
      </div>
      {isNewChat ? (
        <Start onPickOption={handleConversationStarter} />
      ) : (
        <ChatList isLoading={isLoading} messages={messages} />
      )}
      <div className="p-4 border-t">
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
