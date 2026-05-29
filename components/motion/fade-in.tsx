"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  inView?: boolean;
};

export function FadeIn({
  children,
  delay = 0,
  inView = false,
  className,
  ...props
}: FadeInProps) {
  const transition = { duration: 0.5, delay, ease: "easeOut" as const };
  const visible = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      {...(inView
        ? { whileInView: visible, viewport: { once: true, margin: "-48px" } }
        : { animate: visible })}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
