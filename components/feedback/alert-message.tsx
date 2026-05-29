"use client";

import { motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type AlertVariant = "error" | "success";

const variantStyles: Record<
  AlertVariant,
  { className: string; Icon: LucideIcon }
> = {
  error: {
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    Icon: AlertCircle,
  },
  success: {
    className: "border-success/30 bg-success/10 text-success",
    Icon: CheckCircle2,
  },
};

type AlertMessageProps = {
  variant: AlertVariant;
  children: React.ReactNode;
  animated?: boolean;
  className?: string;
};

export function AlertMessage({
  variant,
  children,
  animated = false,
  className,
}: AlertMessageProps) {
  const { className: variantClassName, Icon } = variantStyles[variant];

  const content = (
    <p
      className={cn(
        "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm",
        variantClassName,
        className,
      )}
    >
      <Icon className="size-4 shrink-0" />
      {children}
    </p>
  );

  if (!animated) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
    >
      {content}
    </motion.div>
  );
}
