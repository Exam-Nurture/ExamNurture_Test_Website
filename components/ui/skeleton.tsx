"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

export interface SkeletonProps extends Omit<HTMLMotionProps<"div">, "ref"> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <motion.div
      className={cn("animate-pulse rounded-md bg-[var(--line-soft)]", className)}
      {...props}
    />
  );
}

export { Skeleton };
