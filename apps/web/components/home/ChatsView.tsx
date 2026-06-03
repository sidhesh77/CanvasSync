"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import ChatCard from "./ChatCard";
import { useAppSelector } from "@/lib/hooks/redux";
import { MessageSquare } from "lucide-react";

const ChatsView = () => {
  const rooms = useAppSelector((state) => state.app.rooms);

  if (!rooms) {
    return null;
  }

  return (
    <div className="flex-1 min-h-0">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare size={16} />
            Canvas Rooms
          </CardTitle>
        </CardHeader>
        <CardContent
          ref={undefined}
          className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-2 [&::-webkit-scrollbar]:hidden"
        >
          {rooms.map((room) => (
            <ChatCard key={room.id} room={room} />
          ))}
          {rooms.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm py-8">
              No rooms yet. Create or join one to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatsView;