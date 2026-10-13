"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  let variantStyle = "bg-blue-600 text-white hover:bg-blue-700";

  switch (variant) {
    case "primary":
      variantStyle = "bg-blue-600 text-white hover:bg-blue-700 shadow-xs";
      break;
    case "secondary":
      variantStyle = "bg-slate-800 text-white hover:bg-slate-700";
      break;
    case "outline":
      variantStyle = "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50";
      break;
    case "success":
      variantStyle = "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs";
      break;
    case "danger":
      variantStyle = "bg-red-600 text-white hover:bg-red-700 shadow-xs";
      break;
  }

  let sizeStyle = "px-3 py-2 text-xs lg:px-[14px] lg:py-[8px] lg:text-[13px]";
  if (size === "sm") {
    sizeStyle = "px-2.5 py-1 text-xs lg:px-[10px] lg:py-[5px] lg:text-[11px]";
  } else if (size === "lg") {
    sizeStyle = "px-5 py-2.5 text-sm lg:px-[20px] lg:py-[10px] lg:text-[15px]";
  }

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed lg:rounded-[10px] ${variantStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
