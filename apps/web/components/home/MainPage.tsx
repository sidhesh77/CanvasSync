"use client";

import ChatsView from "@/components/home/ChatsView";
import MeetdrawsView from "@/components/home/MeetdrawsView";
import UserCard from "@/components/home/UserCard";
import { useEffect, useRef } from "react";
import StateButton from "./StateButton";
import CreateRoomView from "./CreateRoomView";
import JoinRoomView from "./JoinRoomView";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { useRouter } from "next/navigation";
import { setHomeView, setRooms, setUser } from "@/lib/features/meetdraw/appSlice";
import { Room, User } from "@/types";
import ChatRoom from "./ChatRoom";
import { Layers, Plus, Link2, Home } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

interface RequestCookie {
  name: string;
  value: string;
}

const MainPage = ({
  jwtCookie,
  rooms,
  userInfo,
}: {
  jwtCookie: RequestCookie;
  rooms: Room[];
  userInfo: User;
}) => {
  const userState = useAppSelector((state) => state.app.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const homeRef = useRef<HTMLDivElement>(null);
  const homeView = useAppSelector((state) => state.app.homeView);

  useEffect(() => {
    if (!jwtCookie || !jwtCookie.value) {
      router.replace("/signin");
    }
    if (!userState) {
      const user = JSON.parse(sessionStorage.getItem("user")!);
      if (user) {
        dispatch(setUser(user));
      } else if (userInfo) {
        dispatch(setUser({
          id: userInfo.id,
          name: userInfo.name,
          username: userInfo.username,
        }));
      }
    }
  }, [jwtCookie, userState]);

  useEffect(() => {
    if (homeRef.current) {
      dispatch(setRooms(rooms));
    }
  }, [rooms]);

  return (
    <div ref={homeRef} className="flex w-screen h-screen bg-background">
      <div className="w-72 border-r border-border flex flex-col p-4 gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">CanvasSync</span>
        </div>
        <UserCard />
        <ChatsView />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home size={18} />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">
              {homeView === "meetdraws" ? "My Canvases" :
               homeView === "create-room" ? "Create Canvas" :
               homeView === "join-room" ? "Join Canvas" : "Chat"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <StateButton value="meetdraws" onClick={() => dispatch(setHomeView("meetdraws"))} variant="secondary">
              <Layers size={14} className="mr-1" /> My Canvases
            </StateButton>
            <StateButton value="join-room" onClick={() => dispatch(setHomeView("join-room"))} variant="secondary">
              <Link2 size={14} className="mr-1" /> Join
            </StateButton>
            <StateButton value="create-room" onClick={() => dispatch(setHomeView("create-room"))}>
              <Plus size={14} className="mr-1" /> New Canvas
            </StateButton>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {homeView === "meetdraws" && <MeetdrawsView />}
          {homeView === "create-room" && <CreateRoomView />}
          {homeView === "join-room" && <JoinRoomView />}
          {homeView === "chat" && <ChatRoom jwtCookie={jwtCookie} />}
        </div>
      </div>
    </div>
  );
};

export default MainPage;