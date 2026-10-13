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
  let sizeStyle = "px-3.5 py-2 text-xs lg:px-[14px] lg:py-[8px] lg:text-[13px]";
  if (size === "sm") {
    sizeStyle = "px-2.5 py-1 text-xs lg:px-[10px] lg:py-[5px] lg:text-[11px]";
  } else if (size === "lg") {
    sizeStyle = "px-5 py-2.5 text-sm lg:px-[20px] lg:py-[10px] lg:text-[15px]";
  }

  // 1. Tombol Biru Utama (Primary): Efek Timbul 3D Berlapis (Tactile Double-Layer)
  if (variant === "primary") {
    return (
      <button
        disabled={disabled}
        className={`group relative inline-block focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
        {...props}
      >
        {/* Layer Bawah 3D (Dasar/Shadow Biru Gelap) */}
        <span className="absolute inset-0 w-full h-full rounded-xl bg-blue-800 translate-y-1 transition-transform group-hover:translate-y-1.5 group-active:translate-y-0 lg:rounded-[10px]" />

        {/* Layer Atas 3D (Muka Tombol Biru Utama) */}
        <span
          className={`relative inline-flex items-center justify-center font-bold rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white border-t border-blue-400/40 shadow-xs transition-transform transform -translate-y-0.5 group-hover:-translate-y-1 group-active:translate-y-1 lg:rounded-[10px] ${sizeStyle}`}
        >
          {children}
        </span>
      </button>
    );
  }

  // 2. Varian Lainnya
  let variantStyle = "bg-slate-800 text-white hover:bg-slate-700";
  switch (variant) {
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
