"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useAppSelector } from "@/lib/hooks/redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, Layers } from "lucide-react";
import { signoutAction } from "@/actions/authActions";

const UserCard = () => {
  let user = useAppSelector((state) => state.app.user);
  const rooms = useAppSelector((state) => state.app.rooms);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const SessionUser = JSON.parse(sessionStorage.getItem("user") || "null");
      if (!SessionUser || SessionUser === null) {
        window.location.href = "/signin";
      }
      user = SessionUser;
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground uppercase">
                {user.username.charAt(0)}
              </span>
            </div>
            <span className="text-base">{user.name}</span>
          </CardTitle>
          <button
            onClick={() => {
              signoutAction();
              sessionStorage.clear();
              router.replace("/signin");
            }}
            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{user.username}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <Layers size={14} />
          {rooms?.length ?? 0} canvas{rooms?.length !== 1 ? "es" : ""}
        </p>
      </CardContent>
    </Card>
  );
};

export default UserCard;