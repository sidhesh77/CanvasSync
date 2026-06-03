"use client";

import { useActionState, useEffect } from "react";
import FormInput from "../common/FormInput";
import SubmitButton from "../common/SubmitButton";
import { X } from "lucide-react";
import { joinRoomAction } from "@/actions/roomActions";
import { useRouter } from "next/navigation";
import { setHomeView } from "@/lib/features/meetdraw/appSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Card, CardContent } from "@workspace/ui/components/card";

const JoinRoomView = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(joinRoomAction, {
    message: "",
    room: undefined,
  });

  useEffect(() => {
    if (state.room) {
      router.push(`/canvas/${state.room.id}`);
    }
  }, [state.room]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Join Canvas</h3>
        <button
          onClick={() => dispatch(setHomeView("meetdraws"))}
          className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md border-2 shadow-sm">
          <CardContent className="pt-6">
            <form className="flex flex-col gap-5" action={formAction}>
              <FormInput
                id="joinCode"
                name="joinCode"
                type="text"
                required={true}
                placeholder="Enter the join code"
              />
              <SubmitButton pending={isPending} loadingText="Joining...">
                {isPending ? "Joining..." : "Join Canvas"}
              </SubmitButton>
              {state.message && (
                <p className={`text-center text-sm ${state.message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                  {state.message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinRoomView;