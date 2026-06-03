"use client";

import { Room } from "@/types";
import { setActiveRoom, setHomeView } from "@/lib/features/meetdraw/appSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { MessageSquare } from "lucide-react";

const ChatCard = ({ room }: { room: Room }) => {
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => {
        dispatch(setHomeView("chat"));
        dispatch(setActiveRoom(room));
      }}
      className="w-full p-3 rounded-xl border-2 border-border cursor-pointer hover:border-primary/30 hover:bg-muted/20 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <MessageSquare size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{room.title}</p>
          <p className="text-xs text-muted-foreground truncate">
            {room.Chat[0]?.user?.username
              ? `${room.Chat[0].user.username}: ${room.Chat[0].content}`
              : `By ${room.admin.username}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;