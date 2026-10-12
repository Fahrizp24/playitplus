"use client";

import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`w-full bg-white border border-zinc-200 rounded-2xl shadow-sm dark:bg-zinc-900/60 dark:border-zinc-800 lg:rounded-[16px] ${className}`}
    >
      {children}
    </div>
  );
}
