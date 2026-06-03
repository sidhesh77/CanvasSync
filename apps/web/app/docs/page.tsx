"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Server, Monitor, History, Terminal } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-chart-2/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-12 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              Under the Hood
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            CanvasSync is built for performance. Here's a look at the technical decisions that make real-time collaborative drawing feel effortless.
          </p>
        </motion.div>

        <div className="space-y-32">
          {[
            {
              icon: <Server className="w-6 h-6" />,
              color: "primary",
              title: "WebSocket Real-Time Sync",
              desc: "We use WebSockets instead of HTTP polling to synchronize drawing data. Each room maintains an in-memory connection map for O(1) routing, broadcasting changes to all collaborators in milliseconds.",
              points: ["Persistent TCP connections via Node `ws`", "Delta payloads minimize bandwidth", "Cursor positions synced in real-time"],
            },
            {
              icon: <Monitor className="w-6 h-6" />,
              color: "chart-2",
              title: "Canvas Rendering Loop",
              desc: "Drawing at 60fps requires bypassing React's reconciler. We store drawing state in mutable refs and use requestAnimationFrame to sync directly with the monitor refresh rate.",
              points: ["Drawing state in `useRef` instead of React state", "Canvas API paints vectors to pixel buffer", "No Virtual DOM overhead during drawing"],
            },
            {
              icon: <History className="w-6 h-6" />,
              color: "chart-3",
              title: "Deterministic Undo/Redo",
              desc: "We store action deltas rather than full canvas clones. Each action records the transition from originalDraw to modifiedDraw, making undo memory-efficient.",
              points: ["Linear action buffer (max 50 actions)", "Only affected shapes are reverted", "Remote actions from WS broadcast correctly"],
            },
          ].map((section, i) => (
            <motion.section key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <div className={`w-12 h-12 rounded-xl bg-${section.color}/10 flex items-center justify-center mb-6 text-${section.color}`}>
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{section.desc}</p>
                <ul className="space-y-2">
                  {section.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-foreground/80">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-7 bg-card rounded-2xl border-2 border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <div className="w-3 h-3 rounded-full bg-green-400/60" />
                </div>
                <div className="p-6 font-mono text-sm text-foreground/80">
                  <div className={`text-${section.color}`}>// ${section.title}</div>
                  <div className="mt-2 opacity-60">// Implementation detail shown here</div>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        <div className="mt-32 pt-16 border-t border-border text-center">
          <h3 className="text-2xl font-bold mb-4">Want to try it?</h3>
          <Link href="/signup">
            <Button size="lg">Create a Free Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}