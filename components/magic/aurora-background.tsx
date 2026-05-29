import * as React from "react";

import { cn } from "@/lib/utils";

type AuroraBackgroundProps = React.ComponentProps<"div"> & {
  showRadialGradient?: boolean;
};

/**
 * Soft animated aurora gradient backdrop. Purely decorative and pointer-safe.
 */
export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-background",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-60 dark:opacity-40"
      >
        <div
          className={cn(
            "absolute -inset-[15%] animate-aurora transform-gpu blur-2xl will-change-transform",
            "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]",
            "from-primary/40 via-fuchsia-400/30 to-sky-400/30",
            "bg-gradient-to-br",
          )}
          style={{
            backgroundImage:
              "conic-gradient(from 120deg at 50% 50%, color-mix(in oklch, var(--primary) 55%, transparent), color-mix(in oklch, var(--chart-3) 50%, transparent), color-mix(in oklch, var(--chart-2) 45%, transparent), color-mix(in oklch, var(--primary) 55%, transparent))",
          }}
        />
        {showRadialGradient ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_var(--background)_78%)]" />
        ) : null}
      </div>
      {children}
    </div>
  );
}
