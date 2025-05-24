"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import {
  Sparkles,
  X,
  ArrowUp,
  Minimize2,
  MessageSquareOff,
  MessageSquareQuote,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const quickPrompts = [
  {
    icon: MessageSquareQuote,
    text: "면담 수락",
    description: "ex) 오늘 일정 모두 수락해줘",
  },
  {
    icon: MessageSquareOff,
    text: "면담 거절",
    description: "ex) 오늘 일정 모두 거절해줘",
  },
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userInfo = useUserStore(state => state.userInfo);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (message?: string, guideMessage?: string) => {
    const messageToSend = message || input;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      role: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    setShowQuickPrompts(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await res.json();
      if (data.extracted) {
        // LLM이 추출한 날짜/시간을 store 값과 합치기
        const fullPayload = {
          ...data.extracted,
          id: userInfo?.id,
          professor_id: userInfo?.id,
        };
        // 이걸 다시 면담 수락/거절 API로 보내기
        console.log("최종 예약 요청 payload:", fullPayload);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.reply || "답변을 가져오지 못했습니다.",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply || "답변을 가져오지 못했습니다.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "⚠️ 오류가 발생했습니다. 다시 시도해주세요.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    const responseMap: Record<string, string> = {
      "면담 수락": "면담을 수락할 일정을 말씀해주세요.",
      "면담 거절": "면담을 거절할 일정을 말씀해주세요.",
    };

    handleSend(prompt, responseMap[prompt]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      setMessages([]);
      setShowQuickPrompts(true);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="group fixed right-8 bottom-8 z-50 h-12 rounded-full border border-gray-200 bg-white px-4 text-gray-700 shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl"
        size="lg"
      >
        <div className="flex items-center">
          <Sparkles className="group-hover:text-primary mr-2 h-5 w-5 font-bold text-[#000000] transition-colors" />
          <span className="group-hover:text-primary font-bold">KNOCK AI</span>
        </div>
      </Button>
    );
  }

  // Minimized State
  if (isMinimized) {
    return (
      <Card className="fixed right-8 bottom-8 z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="to-primary bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-primary text-sm font-bold">KNOCK AI</h3>
              <p className="text-xs text-gray-500">AI로 면담 일정을 관리해 보세요.</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={maximizeChat}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Full Chat Widget (Notion style, no overlay)
  return (
    <Card className="fixed right-4 bottom-4 z-50 flex h-[500px] w-90 flex-col gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-2xl md:right-8 md:bottom-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="to-primary bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-primary font-bold">KNOCK AI</h3>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={minimizeChat}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleChat}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="h-80 p-4" ref={scrollAreaRef}>
        <div className="h-full space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center">
              <h4 className="font-bold text-gray-800">일정 관리를 도와드릴게요.</h4>
            </div>
          )}

          {/* Quick Prompts */}
          {showQuickPrompts && messages.length === 0 && (
            <div className="grid grid-cols-1 gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="flex h-auto items-center justify-start border-gray-200 p-3 text-left hover:bg-gray-50"
                >
                  <prompt.icon className="mr-3 h-4 w-4 flex-shrink-0 text-gray-600" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-800">{prompt.text}</div>
                    <div className="truncate text-xs text-gray-500">{prompt.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {/* Messages */}
          {messages.map(message => (
            <div key={message.id} className="space-y-2">
              {message.role === "user" && (
                <div className="flex justify-end">
                  <div className="max-w-[85%]">
                    <Badge variant="secondary" className="mb-1 bg-gray-200 text-xs text-gray-800">
                      Me
                    </Badge>
                    <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900">
                      {message.content}
                    </div>
                  </div>
                </div>
              )}

              {message.role === "assistant" && (
                <div className="max-w-[90%]">
                  <Badge variant="secondary" className="mb-1 bg-[#81695860] text-xs text-gray-800">
                    <Sparkles className="mr-1 h-3 w-3" />
                    AI
                  </Badge>
                  <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-800">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="max-w-[90%]">
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="bg-primary h-2 w-2 animate-bounce rounded-full"></div>
                    <div
                      className="bg-primary h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="bg-primary h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-100 p-4">
        <div className="relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="무엇을 도와드릴까요?"
            className="h-10 border-gray-200 pr-10 text-sm focus:border-gray-300 focus:ring-gray-200"
            disabled={isTyping}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            size="sm"
            className="bg-primary absolute top-1 right-1 h-8 w-8 p-0 hover:bg-[#816958]"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
