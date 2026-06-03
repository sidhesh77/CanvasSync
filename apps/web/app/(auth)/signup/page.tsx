import SignupForm from "@/components/auth/SignupForm";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function page() {
  const jwtCookie = (await cookies()).get("jwt");

  return (
    <div className="min-h-screen w-screen relative flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-chart-2/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20 L12 4 L20 20" />
                <path d="M8 15 L16 15" />
              </svg>
            </div>
            <span className="text-xl font-bold">CanvasSync</span>
          </Link>
        </div>
        <SignupForm jwtCookie={jwtCookie || null} />
      </div>
    </div>
  );
}