"use client";
import React from "react";
import Boxes from "./Boxes"; // Adjusted path
import { cn } from "../../lib/utils"; // Adjusted path

export interface AnimatedBackgroundContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  containerClassName?: string;
}

export function AnimatedBackgroundContainer({
  children,
  title = "Welcome",
  subtitle = "Please sign in to continue",
  containerClassName,
}: AnimatedBackgroundContainerProps) {
  return (
    <div
      className={cn(
        "min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      {/* Content will be passed as children, including the login form card */}
      <div className="relative z-30 w-full max-w-md p-4">
        {children} 
      </div>
    </div>
  );
} 