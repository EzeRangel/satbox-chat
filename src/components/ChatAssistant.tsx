"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, X, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
  timestamp: number;
}

const predefinedQuestions = [
  "What services do you offer?",
  "How can I contact support?",
  "What are your business hours?",
  "Do you have a refund policy?",
];

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chatOpen") === "true";
    }
    return false;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatMessages");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              text: "Hello! How can I assist you today?",
              sender: "assistant",
              timestamp: Date.now(),
            },
          ];
    }
    return [
      {
        id: 1,
        text: "Hello! How can I assist you today?",
        sender: "assistant",
        timestamp: Date.now(),
      },
    ];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("chatOpen", isOpen.toString());
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (text: string) => {
    if (text.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text,
        sender: "user",
        timestamp: Date.now(),
      };
      setMessages([...messages, newMessage]);
      setInput("");
      setIsTyping(true);

      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: messages.length + 2,
          text: `You asked: "${text}". I'm a minimalistic chat assistant, so I don't have a specific answer for that question. How else can I help you?`,
          sender: "assistant",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);
    }
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
          <div className="p-4 border-b flex justify-between items-center">
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.text}
                  <div className="text-xs mt-1 opacity-50">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Assistant is typing...</span>
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
                    onClick={() => handleSend(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex space-x-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
