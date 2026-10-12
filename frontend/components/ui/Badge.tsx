"use client";

import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
  title?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  title,
}: BadgeProps) {
  let variantStyle = "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";

  switch (variant) {
    case "primary":
      variantStyle =
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
      break;
    case "success":
      variantStyle =
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
      break;
    case "warning":
      variantStyle =
        "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
      break;
    case "danger":
      variantStyle =
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800";
      break;
    case "neutral":
    default:
      variantStyle =
        "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
      break;
  }

  const sizeStyle =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 rounded-full lg:text-[11px] lg:px-[8px] lg:py-[2px] lg:rounded-[9999px]"
      : "text-xs px-2.5 py-1 rounded-full lg:text-[12px] lg:px-[10px] lg:py-[3px] lg:rounded-[9999px]";

  return (
    <span
      title={title}
      className={`inline-flex items-center font-medium border ${variantStyle} ${sizeStyle} ${className}`}
    >
      {children}
    </span>
  );
}
