import CreateForm from "@/components/room/CreateForm";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen w-screen relative flex items-center justify-center bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20 L12 4 L20 20" />
              <path d="M8 15 L16 15" />
            </svg>
          </div>
          <span className="text-xl font-bold">CanvasSync</span>
        </Link>
      </div>
      <CreateForm />
    </div>
  );
};

export default page;