import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-2 border-border bg-transparent flex h-11 w-full rounded-xl border-b-4 bg-card px-4 py-2 text-base shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary/50 focus-visible:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]",
        "aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }