import * as React from "react";

import { cn } from "@/lib/utils";

type ShimmerButtonProps = React.ComponentProps<"button"> & {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
};

/**
 * Button with a rotating shimmer ring and spark sweep.
 */
export function ShimmerButton({
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "2.5s",
  borderRadius = "9999px",
  background = "color-mix(in oklch, var(--primary) 92%, black)",
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={
        {
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        } as React.CSSProperties
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-7 py-3 text-sm font-medium text-white [background:var(--bg)] [border-radius:var(--radius)]",
        "transform-gpu transition-transform duration-300 active:translate-y-px",
        "shadow-[0_4px_24px_-4px_color-mix(in_oklch,var(--primary)_60%,transparent)] hover:shadow-[0_8px_32px_-6px_color-mix(in_oklch,var(--primary)_70%,transparent)]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 -z-30 overflow-visible [container-type:size]">
        <div className="absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none]">
          <div className="absolute -inset-full w-auto rotate-0 animate-spin transform-gpu will-change-transform [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </div>
      </div>
      {children}
      <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full [border-radius:var(--radius)] transition-all duration-300 group-hover:[box-shadow:inset_0_-6px_10px_#ffffff3f] group-active:[box-shadow:inset_0_-10px_10px_#ffffff3f]" />
    </button>
  );
}
