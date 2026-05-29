import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Text with an animated shining gradient sweep.
 */
export function AnimatedGradientText({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-block animate-shine bg-[length:200%_100%] bg-clip-text text-transparent",
        "bg-gradient-to-r from-primary via-fuchsia-500 to-sky-500",
        "dark:from-primary dark:via-fuchsia-400 dark:to-sky-400",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
