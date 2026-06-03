"use client";

import { useActionState } from "react";
import { createRoomAction } from "@/actions/roomActions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Layers } from "lucide-react";

const CreateForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createRoomAction, {
    message: "",
    room: undefined,
  });

  useEffect(() => {
    if (state.room) {
      router.push(`/canvas/${state.room.id}`);
    }
  }, [state.room]);

  return (
    <Card className="w-full max-w-md border-2 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Layers size={24} className="text-primary" />
        </div>
        <CardTitle className="text-xl">Create a Canvas</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="title">Canvas Name</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="My awesome canvas"
              required
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full h-11 text-base font-semibold">
            {isPending ? "Creating..." : "Create Canvas"}
          </Button>
          {state.message && (
            <p className={`text-center text-sm ${state.message.includes("success") ? "text-green-500" : "text-red-500"}`}>
              {state.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateForm;