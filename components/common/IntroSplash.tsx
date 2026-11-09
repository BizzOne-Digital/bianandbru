"use client";

import { useEffect, useState } from "react";
import { BearMark } from "./Logo";

/**
 * Short brand intro shown once per browser session on first load.
 * Skipped entirely for users who prefer reduced motion.
 */
export function IntroSplash({ name = "BIAN&BRU", company = "INTERPAAB LLC" }: { name?: string; company?: string }) {
  const [phase, setPhase] = useState<"hidden" | "show" | "leave">("hidden");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("bb_intro") === "1";
      sessionStorage.setItem("bb_intro", "1");
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("show");
    const t1 = setTimeout(() => setPhase("leave"), 1300);
    const t2 = setTimeout(() => setPhase("hidden"), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      onClick={() => setPhase("hidden")}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-baby via-warm to-blush-soft transition-opacity duration-500 ${
        phase === "leave" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="animate-badge-in">
          <BearMark className="h-24 w-28 animate-float" />
        </div>
        <p className="mt-4 animate-fade-up font-serif text-4xl font-semibold tracking-wide text-navy [animation-delay:250ms]">{name}</p>
        <p className="mt-1 animate-fade-up text-xs tracking-[0.45em] text-navy/70 [animation-delay:400ms]">{company}</p>
        <span className="mt-6 h-0.5 w-0 animate-[grow_0.9s_ease-out_0.5s_forwards] rounded-full bg-rose" style={{ maxWidth: 140 }} />
      </div>
      <style>{`@keyframes grow{to{width:140px}}`}</style>
    </div>
  );
}
