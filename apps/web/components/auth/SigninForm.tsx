"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { signinAction } from "@/actions/authActions";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setUser } from "@/lib/features/meetdraw/appSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { toast } from "@workspace/ui/components/sonner";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface RequestCookie {
  name: string;
  value: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full h-11 text-base font-semibold">
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          Signing in...
        </span>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}

export default function SigninForm({
  jwtCookie,
}: {
  jwtCookie: RequestCookie | null;
}) {
  const initialState = { message: "", errors: {} };
  const [state, formAction] = useActionState(signinAction, initialState);
  const userState = useAppSelector((state) => state.app.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser && jwtCookie && jwtCookie.value) {
      dispatch(setUser(JSON.parse(sessionUser)));
      router.replace("/home");
    } else if (state.user) {
      const user = {
        id: state.user.id,
        name: state.user.name,
        username: state.user.username,
      };
      sessionStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
    }
  }, [state.user]);

  useEffect(() => {
    if (jwtCookie && jwtCookie.value && userState) {
      router.replace("/home");
    }
  }, [userState]);

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state.message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full border-2 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-base mt-1">
            Sign in to your CanvasSync account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="yourname"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  minLength={8}
                  required
                />
              </div>
              {state.message && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {state.message}
                </div>
              )}
              <SubmitButton />
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create one free
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}