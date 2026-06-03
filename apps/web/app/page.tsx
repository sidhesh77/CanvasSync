"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Layers,
  Zap,
  MessageSquare,
  LinkIcon,
  Globe,
  MousePointer2,
  Terminal,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const FloatingOrb = ({
  className,
  delay = 0,
  duration = 20,
}: {
  className: string;
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    animate={{
      x: [0, 40, 0, -40, 0],
      y: [0, -30, 0, 30, 0],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
  />
);

export default function Page() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Infinite Canvas",
      desc: "Draw without boundaries. Pan, zoom, and sketch freely across an unlimited workspace.",
      color: "primary",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Sync",
      desc: "See changes the instant they happen. WebSocket-powered collaboration with zero lag.",
      color: "chart-2",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Built-In Chat",
      desc: "Talk while you draw. Keep the conversation going right alongside your canvas.",
      color: "chart-3",
    },
    {
      icon: <LinkIcon className="w-6 h-6" />,
      title: "One-Click Sharing",
      desc: "Generate a room link and invite anyone. No sign-up required for guests.",
      color: "chart-4",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingOrb
        className="w-[600px] h-[600px] bg-primary/20 top-[-200px] left-[-200px]"
        delay={0}
        duration={25}
      />
      <FloatingOrb
        className="w-[500px] h-[500px] bg-chart-2/15 bottom-[-150px] right-[-150px]"
        delay={5}
        duration={30}
      />
      <FloatingOrb
        className="w-[400px] h-[400px] bg-chart-3/15 top-1/2 right-[10%]"
        delay={10}
        duration={20}
      />

      <motion.div
        className="fixed pointer-events-none z-50 text-primary opacity-70 mix-blend-screen"
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
          scale: isHovering ? 1.5 : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        <Sparkles size={32} />
      </motion.div>

      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">CanvasSync</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground mb-8 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-2"></span>
            </span>
            Now live — invite anyone with a link
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-6"
          >
            Draw together,{" "}
            <span className="text-primary relative">
              think together
              <motion.svg
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 -left-2 -right-2 h-4 text-primary/40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <path d="M2,8 Q60,2 100,8 T198,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A collaborative canvas where your ideas come to life in real-time. No downloads, no complexity — just open and create with your team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start Drawing Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="gap-2">
                Try the Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      </section>

      <section className="py-24 px-6 bg-card border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Everything you need to collaborate
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Powerful tools wrapped in an interface so clean, you'll forget you're using software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl border-2 border-border bg-background hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-5 text-${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-sm text-muted-foreground mb-6">
              <Terminal className="w-4 h-4" />
              Built different
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Engineered for performance, designed for humans.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              We bypass the React reconciler for canvas rendering, sync over WebSockets for instant feedback, and handle undo/redo with smart delta buffers. You get buttery smooth drawing at 60fps.
            </p>
            <Link href="/docs">
              <Button variant="outline" className="gap-2">
                Read the technical deep-dive <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="md:w-1/2 w-full">
            <div className="bg-card rounded-2xl border-2 border-border overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="p-6 font-mono text-sm text-foreground/80 leading-relaxed">
                <div className="text-chart-3">// Infinite canvas viewport</div>
                <div>
                  <span className="text-primary">const</span>{" "}
                  <span className="text-chart-4">panOffset</span> ={" "}
                  <span className="text-foreground">{"{"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-chart-4">x</span>:{" "}
                  <span className="text-foreground">0</span>,{" "}
                  <span className="text-chart-4">y</span>:{" "}
                  <span className="text-foreground">0</span>
                </div>
                <div className="text-foreground">{"}"}</div>
                <div>
                  <span className="text-primary">const</span>{" "}
                  <span className="text-chart-4">zoomScale</span> ={" "}
                  <span className="text-foreground">1</span>
                </div>
                <div className="mt-4 text-chart-3">// 60fps render loop</div>
                <div>
                  <span className="text-foreground">render</span>(
                  <span className="text-chart-4">ctx</span>,{" "}
                  <span className="text-chart-4">shapes</span>,{" "}
                  <span className="text-chart-4">transform</span>)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Ready to start creating?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            It's free. No credit card. Just you, your team, and an infinite canvas.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2 px-10">
              Create Your Canvas <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold">CanvasSync</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, WebSockets, and PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  );
}