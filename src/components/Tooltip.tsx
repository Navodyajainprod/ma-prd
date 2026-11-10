"use client";

import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  align?: "center" | "right" | "left";
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = "top",
  align = "center",
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Determine horizontal alignment classes
  let alignClass = "left-1/2 -translate-x-1/2";
  if (align === "right") {
    alignClass = "right-0 translate-x-0";
  } else if (align === "left") {
    alignClass = "left-0 translate-x-0";
  }

  const positionClasses = {
    top: `bottom-full ${alignClass} mb-2`,
    bottom: `top-full ${alignClass} mt-2`,
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1 text-[11px] font-medium text-white bg-slate-900 dark:bg-zinc-800 rounded-md shadow-md border border-slate-700/60 dark:border-zinc-700 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150 ${positionClasses[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
