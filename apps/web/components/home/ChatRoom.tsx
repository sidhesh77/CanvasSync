"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { toast } from "@workspace/ui/components/sonner";
import { setHomeView } from "@/lib/features/meetdraw/appSlice";
import { useWebSocket } from "@/lib/hooks/websocket";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Send, ExternalLink, Info, Copy, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import { WebSocketMessage } from "@workspace/common";
import { Message } from "@/types";
import { fetchAllChatMessages, fetchMoreChatMessages } from "@/actions/chatActions";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

interface RequestCookie {
  name: string;
  value: string;
}

const ChatRoom = ({ jwtCookie }: { jwtCookie: RequestCookie }) => {
  const activeRoom = useAppSelector((state) => state.app.activeRoom);
  const userState = useAppSelector((state) => state.app.user);
  const [serverReady, setServerReady] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>();
  const chatDivRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState<"down" | "up" | null>(null);
  const [showBadge, setShowBadge] = useState<boolean>(false);
  const [lastSrNo, setLastSrNo] = useState<number>();
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    const fetchMoreMessages = async (): Promise<void> => {
      setIsLoadingMore(true);
      const msgs = await fetchMoreChatMessages(activeRoom!.id, lastSrNo!);
      setMessages((prev) => [...msgs, ...(prev || [])]);
      if (msgs.length === 0) { setLastSrNo(0); setIsLoadingMore(false); return; }
      setLastSrNo(msgs[0]?.serialNumber || 0);
      setIsLoadingMore(false);
    };

    const handleScroll = () => {
      if (!chatDivRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatDivRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      const isAtTop = scrollTop <= 10;
      if (isAtTop) { fetchMoreMessages(); return; }
      setShowArrow(isAtBottom ? "up" : "down");
      if (!isAtBottom) setShowBadge(true);
    };

    chatDivRef.current?.addEventListener("scroll", handleScroll);
    return () => chatDivRef.current?.removeEventListener("scroll", handleScroll);
  }, [messages, lastSrNo]);

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

  if (!userState) {
    router.replace("/signin");
    return null;
  }
  if (!activeRoom) {
    dispatch(setHomeView("meetdraws"));
    return null;
  }

  const { socket, isLoading, isError } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_URL}?token=${jwtCookie.value}`
  );

  useEffect(() => {
    async function fetchMessage() {
      if (activeRoom) {
        const fetchedMessages = await fetchAllChatMessages(activeRoom.id);
        setMessages(fetchedMessages);
        setLastSrNo(fetchedMessages[0]?.serialNumber);
        setTimeout(() => {
          if (chatDivRef.current) {
            chatDivRef.current.scrollTo({ top: chatDivRef.current.scrollHeight, behavior: "smooth" });
          }
        }, 100);
      }
    }
    fetchMessage();
    return () => setMessages([]);
  }, [activeRoom]);

  const handleSendMessage = () => {
    if (!socket || !serverReady || !inputRef.current?.value.trim()) return;
    const chatMessage: WebSocketMessage = {
      type: "chat_message",
      roomId: activeRoom.id,
      userId: userState.id,
      content: inputRef.current.value,
    };
    socket.send(JSON.stringify(chatMessage));
    inputRef.current.value = "";
  };

  useEffect(() => {
    if (!socket || isLoading || isError) return;

    socket.onmessage = (event) => {
      if (event.data === "pong") return;
      let data;
      try { data = JSON.parse(event.data); } catch { return; }
      switch (data.type) {
        case "connection_ready": setServerReady(true); break;
        case "error_message": toast.error(data.content); break;
        case "chat_message":
          setMessages((prev) => [...(prev || []), JSON.parse(data.content)]);
          break;
      }
    };

    const handleShortcuts = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "Enter") { e.preventDefault(); handleSendMessage(); }
    };
    document.addEventListener("keydown", handleShortcuts);
    return () => {
      document.removeEventListener("keydown", handleShortcuts);
    };
  }, [socket, isLoading, isError, activeRoom, userState, serverReady]);

  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(activeRoom.joinCode);
    toast.info("Join code copied!");
  };

  if (isError) return (
    <div className="flex items-center justify-center h-full text-destructive">
      Connection error. Please refresh.
    </div>
  );
  if (isLoading || !serverReady) return (
    <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
      <Loader2 size={16} className="animate-spin" />
      {serverReady ? "Connecting..." : "Verifying..."}
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{activeRoom.title}</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Code</span>
            <span className="text-sm font-bold text-primary">{activeRoom.joinCode}</span>
            <button onClick={handleCopyJoinCode} className="hover:text-primary transition-colors cursor-pointer" title="Copy">
              <Copy size={13} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger><Info size={16} className="text-muted-foreground" /></TooltipTrigger>
            <TooltipContent><p>Admin: {activeRoom.admin.username}</p></TooltipContent>
          </Tooltip>
          <Link href={`/canvas/${activeRoom.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
            Canvas <ExternalLink size={13} />
          </Link>
          <button onClick={() => dispatch(setHomeView("meetdraws"))} className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 border-2 border-border rounded-2xl overflow-hidden flex flex-col bg-card">
        <div ref={chatDivRef} className="flex-1 overflow-y-auto scroll-smooth p-4 flex flex-col gap-2 [&::-webkit-scrollbar]:hidden">
          {isLoadingMore && (
            <div className="flex justify-center items-center gap-2 py-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Loading...
            </div>
          )}
          {messages?.map((message, index) => {
            const time = new Date(message.createdAt);
            const isMine = message.userId === userState.id;
            return (
              <div key={index} className={`flex flex-col gap-0.5 max-w-[75%] ${isMine ? "self-end items-end" : "self-start items-start"}`}>
                <span className="text-xs text-muted-foreground px-1">{message.user.username}</span>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMine ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                  <p>{message.content}</p>
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
            className="absolute bottom-24 right-6 rounded-full bg-primary text-primary-foreground p-2 shadow-lg cursor-pointer">
            {showBadge && <span className="absolute -top-1 -right-1 w-3 h-3 bg-chart-2 rounded-full" />}
            <ChevronDown size={16} />
          </button>
        )}
        {showArrow === "up" && (
          <button onClick={() => chatDivRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="absolute bottom-24 right-6 rounded-full bg-muted p-2 shadow cursor-pointer">
            <ChevronUp size={16} />
          </button>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-3">
        <textarea
          ref={inputRef}
          placeholder="Type a message... (Cmd+Enter to send)"
          className="flex-1 border-2 border-border rounded-xl p-3 resize-none bg-card focus:border-primary/50 focus:ring-0 transition-colors outline-none text-sm"
          rows={1}
        />
        <Button type="submit" size="icon" className="h-11 w-11 shrink-0">
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
};

export default ChatRoom;