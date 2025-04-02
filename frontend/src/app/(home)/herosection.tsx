import React from "react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="mt-45 flex items-center justify-center w-full flex-col px-4">
      <h2 className="text-center text-4xl md:text-6xl lg:text-8xl font-sans pb-2 md:pb-10 relative z-20 font-bold tracking-tight">
        <span className="text-[#FF9933]">Savdhaan</span>{" "}
        <span className="text-black dark:text-gray-300">rahein,</span>
        <br />
        <span className="text-[#138808]">Satark rahein.</span>
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        Vakeel.ai ke saath spot risks, ensure compliance, and negotiate
        smarter—all with AI-powered contract analysis.
      </p>
    </div>
  );
}
