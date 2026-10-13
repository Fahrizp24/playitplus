"use client";

import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`w-full bg-white border border-slate-200 rounded-2xl shadow-xs lg:rounded-[16px] ${className}`}
    >
      {children}
    </div>
  );
}
