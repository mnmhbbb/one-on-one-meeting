"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { Sparkles, X, ArrowUp, Minimize2, Calendar } from "lucide-react";
import { useUserStore } from "@/store/userStore";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const quickPrompts = [
  // {
  //   icon: MessageSquareQuote,
  //   text: "면담 수락",
  //   description: "ex) 오늘 일정 모두 수락해줘",
  // },
  // {
  //   icon: MessageSquareOff,
  //   text: "면담 거절",
  //   description: "ex) 오늘 일정 모두 거절해줘",
  // },
  {
    icon: Calendar,
    text: "면담 목록 조회",
    description: "ex) 이번 주 면담 목록 보여줘",
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
    if (guideMessage) {
      const guideMessageObj: Message = {
        id: crypto.randomUUID(),
        content: guideMessage,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, guideMessageObj]);
      setInput(""); // 입력창 비우기
      return;
    }

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
      console.log("서버 응답:", data);

      // AI 메시지는 무조건 추가
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: data.reply || "답변을 가져오지 못했습니다.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // extracted가 있으면 후속 작업
      if (data.extracted) {
        const fullPayload = {
          ...data.extracted,
          id: userInfo?.id,
        };
        return;
      }

      // tool call 결과가 있는 경우 처리
      if (data.toolCallResult) {
        console.log("Tool call 결과:", data.toolCallResult);

        // 면담 목록 조회 결과인 경우 추가 정보 표시
        if (data.toolCallResult.result && data.toolCallResult.result.interviews) {
          const { interviews, summary, period } = data.toolCallResult.result;

          // 상세 면담 정보를 추가 메시지로 표시
          if (interviews.length > 0) {
            const detailMessage = formatInterviewDetails(interviews, period);
            const detailMessageObj: Message = {
              id: crypto.randomUUID(),
              content: detailMessage,
              role: "assistant",
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, detailMessageObj]);
          }
        }
        return;
      }

      // fallback: reply 안에 function-call JSON이 담긴 경우
      try {
        const maybeFunction = JSON.parse(data.reply);
        if (maybeFunction?.type === "function" && maybeFunction?.parameters) {
          const fullPayload = {
            ...maybeFunction.parameters,
            id: userInfo?.id,
          };
        }
      } catch (e) {}
    } catch (err) {
      console.error("에러 발생:", err);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "⚠️ 오류가 발생했습니다. 다시 시도해주세요.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // 면담 상세 정보 포맷팅 함수
  const formatInterviewDetails = (interviews: any[], period: { start: string; end: string }) => {
    const sortedInterviews = interviews.sort(
      (a, b) => new Date(a.interview_date).getTime() - new Date(b.interview_date).getTime()
    );

    let details = `📅 **${period.start} ~ ${period.end} 면담 상세**\n\n`;

    sortedInterviews.forEach((interview, index) => {
      const date = new Date(interview.interview_date).toLocaleDateString("ko-KR");
      const timeSlots = Array.isArray(interview.interview_time)
        ? interview.interview_time.join(", ")
        : interview.interview_time || "시간 미정";

      const statusIcon = getStatusIcon(interview.interview_state);

      details += `${index + 1}. ${statusIcon} **${date}**\n`;
      details += `   • 시간: ${timeSlots}\n`;
      details += `   • 학생: ${interview.student_name || "미정"}\n`;
      details += `   • 상태: ${interview.interview_state || "상태 미정"}\n`;

      if (interview.interview_reject_reason) {
        details += `   • 거절 사유: ${interview.interview_reject_reason}\n`;
      }

      details += "\n";
    });

    return details;
  };

  // 상태별 아이콘 반환
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "면담 확정":
        return "✅";
      case "면담 거절":
        return "❌";
      case "면담 대기":
        return "⏳";
      default:
        return "📋";
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    const guideMap: Record<string, string> = {
      "면담 수락": "면담을 수락할 일정을 말씀해주세요.",
      "면담 거절": "면담을 거절할 일정을 말씀해주세요.",
      "면담 목록 조회":
        "조회할 기간을 말씀해주세요. <br/> ex) 이번 주, 오늘, 2024-01-01 ~ 2024-01-31",
    };
    const guide = guideMap[prompt];
    // 유도 메시지만 보여주고 사용자 입력을 기다림
    handleSend(undefined, guide);
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
                  <div
                    className="rounded-lg border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-800"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
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
                  <span className="text-xs text-gray-500">생각 중...</span>
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
