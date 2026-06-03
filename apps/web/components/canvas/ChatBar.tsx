"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Send, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Message } from "@/types";

interface ChatBarProps {
  closeChat: () => void;
  messages: Message[];
  user: { id: string; username: string };
  onSendMessage: (content: string) => void;
  onLoadMoreMessages: () => Promise<Message[]>;
  isLoadingMore: boolean;
  chatMessageInputRef: React.RefObject<HTMLTextAreaElement | null>;
}

const ChatBar = ({
  closeChat,
  messages,
  user,
  onSendMessage,
  onLoadMoreMessages,
  isLoadingMore,
  chatMessageInputRef,
}: ChatBarProps) => {
  const chatDivRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState<"down" | "up" | null>(null);
  const [showBadge, setShowBadge] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = async () => {
      if (!chatDivRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatDivRef.current;
      const isAtTop = scrollTop <= 10;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isAtTop && !isLoadingMore) {
        const prevH = scrollHeight;
        const newMessages = await onLoadMoreMessages();
        if (newMessages.length > 0) {
          setTimeout(() => {
            if (chatDivRef.current) {
              chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight - prevH;
            }
          }, 0);
        }
        return;
      }
      setShowArrow(isAtBottom ? "up" : "down");
      if (!isAtBottom) setShowBadge(true);
    };

    chatDivRef.current?.addEventListener("scroll", handleScroll);
    return () => chatDivRef.current?.removeEventListener("scroll", handleScroll);
  }, [messages, onLoadMoreMessages, isLoadingMore]);

  useEffect(() => {
    if (chatDivRef.current && !isLoadingMore) {
      const { scrollTop, scrollHeight, clientHeight } = chatDivRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        chatDivRef.current.scrollTo({ top: scrollHeight, behavior: "smooth" });
      } else {
        setShowBadge(true);
      }
    }
  }, [messages, isLoadingMore]);

  const handleSendMessage = () => {
    if (chatMessageInputRef.current?.value.trim()) {
      onSendMessage(chatMessageInputRef.current.value);
      chatMessageInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed right-4 top-4 bottom-4 z-50 w-80 bg-card border-2 border-border rounded-2xl flex flex-col shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-bold">Chat</h3>
        <button onClick={closeChat} className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 relative min-h-0">
        <div ref={chatDivRef} className="h-full overflow-y-auto p-3 flex flex-col gap-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
          {isLoadingMore && (
            <div className="flex justify-center items-center gap-2 py-2">
              <Loader2 size={14} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          )}
          {messages.map((message, index) => {
            const time = new Date(message.createdAt);
            const isOwnMessage = message.userId === user.id;
            return (
              <div key={message.id || index} className={`flex flex-col gap-0.5 max-w-[85%] ${isOwnMessage ? "self-end items-end" : "self-start items-start"}`}>
                <span className="text-xs text-muted-foreground px-1">{message.user.username}</span>
                <div className={`px-3 py-2 rounded-xl text-sm ${isOwnMessage ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                  <p className="break-words">{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground/60 px-1">
                  {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                </span>
              </div>
            );
          })}
        </div>
        {showArrow === "down" && (
          <button onClick={() => chatDivRef.current?.scrollTo({ top: chatDivRef.current.scrollHeight, behavior: "smooth" })}
            className="absolute bottom-2 right-2 bg-card border border-border rounded-full p-2 shadow cursor-pointer hover:bg-muted transition-colors">
            {showBadge && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-chart-2 rounded-full" />}
            <ChevronDown size={14} />
          </button>
        )}
        {showArrow === "up" && (
          <button onClick={() => chatDivRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="absolute bottom-2 right-2 bg-muted rounded-full p-2 shadow cursor-pointer">
            <ChevronUp size={14} />
          </button>
        )}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-end gap-2">
          <textarea
            ref={chatMessageInputRef}
            placeholder="Message..."
            className="flex-1 bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm resize-none max-h-20 min-h-[2.5rem] focus:outline-none focus:border-primary/50 transition-colors [&::-webkit-scrollbar]:hidden"
            rows={1}
            onKeyDown={(e) => {
              if (e.metaKey && e.key === "Enter") { e.preventDefault(); handleSendMessage(); }
              e.stopPropagation();
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 80)}px`;
            }}
          />
          <Button onClick={handleSendMessage} size="icon" className="h-9 w-9 shrink-0">
            <Send size={14} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-center">⌘ + Enter to send</p>
      </div>
    </div>
  );
};

export default ChatBar;