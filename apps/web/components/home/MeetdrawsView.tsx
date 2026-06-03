"use client";

import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import MeetdrawCard from "./MeetdrawCard";
import { useAppSelector } from "@/lib/hooks/redux";
import { useState } from "react";
import { Layers } from "lucide-react";

const MeetdrawsView = () => {
  const rooms = useAppSelector((state) => state.app.rooms) || [];
  const [search, setSearch] = useState("");

  if (!rooms) return null;

  const filteredRooms = rooms.filter((room) =>
    room.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">My Canvases</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10 w-64"
            placeholder="Search canvases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {filteredRooms.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3 py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Layers size={28} className="text-muted-foreground/50" />
          </div>
          <p className="text-sm">No canvases found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {filteredRooms.map((room) => (
            <MeetdrawCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetdrawsView;