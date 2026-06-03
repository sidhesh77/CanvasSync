"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Room } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { renderDraws } from "@/lib/canvas/drawFunctions";
import { Layers, Calendar } from "lucide-react";

const CanvasCard = ({ room }: { room: Room }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const draws = room.Draw ?? [];

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        draws.forEach((draw) => {
          if (draw.startX !== undefined && draw.startY !== undefined) {
            minX = Math.min(minX, draw.startX);
            minY = Math.min(minY, draw.startY);
            maxX = Math.max(maxX, draw.startX);
            maxY = Math.max(maxY, draw.startY);
          }
          if (draw.endX !== undefined && draw.endY !== undefined) {
            minX = Math.min(minX, draw.endX);
            minY = Math.min(minY, draw.endY);
            maxX = Math.max(maxX, draw.endX);
            maxY = Math.max(maxY, draw.endY);
          }
          if (draw.points) {
            draw.points.forEach((point) => {
              minX = Math.min(minX, point.x);
              minY = Math.min(minY, point.y);
              maxX = Math.max(maxX, point.x);
              maxY = Math.max(maxY, point.y);
            });
          }
        });

        const padding = 20;
        minX -= padding; minY -= padding; maxX += padding; maxY += padding;
        const dw = maxX - minX, dh = maxY - minY;
        const cw = rect.width, ch = rect.height;
        let scale = 1;
        if (dw > 0 && dh > 0) {
          scale = Math.min(cw / dw, ch / dh);
          scale = Math.min(Math.max(scale, 0.1), 2);
        }
        const panOffset = {
          x: (cw - dw * scale) / 2 - minX * scale,
          y: (ch - dh * scale) / 2 - minY * scale,
        };

        renderDraws(ctx, canvas, draws, null, null, "draw", null, [], panOffset, scale);
      }
    }
  }, [room.Draw]);

  return (
    <Card
      onClick={() => router.push(`/canvas/${room.id}`)}
      className="group cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base truncate pr-2">{room.title}</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Calendar size={12} />
            {new Date(room.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <canvas
          ref={canvasRef}
          className="w-full bg-muted/30 rounded-xl"
          style={{ minHeight: "120px", height: "140px" }}
        />
      </CardContent>
    </Card>
  );
};

export default CanvasCard;