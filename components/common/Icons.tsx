import {
  Award,
  Baby,
  BookOpen,
  Gift,
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAP: Record<string, LucideIcon> = {
  truck: Truck,
  award: Award,
  heart: Heart,
  gift: Gift,
  shield: ShieldCheck,
  book: BookOpen,
  target: Target,
  star: Star,
  sparkles: Sparkles,
  baby: Baby,
};

export function BrandIcon({ name, className, strokeWidth = 1.5 }: { name?: string; className?: string; strokeWidth?: number }) {
  const I = MAP[(name || "").toLowerCase()] ?? Heart;
  return <I aria-hidden className={className} strokeWidth={strokeWidth} />;
}

/** Hand-drawn style line heart used as decorative accent (matches reference). */
export function HeartLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" fill="none" aria-hidden className={cn("text-rose", className)}>
      <path
        d="M24 36C14 28 4 21 4 12.5 4 7 8.3 3 13.3 3c4.3 0 7.4 2.6 10.7 7 3.3-4.4 6.4-7 10.7-7C39.7 3 44 7 44 12.5 44 21 34 28 24 36Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M38 6c2 1.5 3 3.5 3 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Small sparkle strokes used around headings and promo panels. */
export function Sparks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 30" fill="none" aria-hidden className={cn("text-rose", className)}>
      <path d="M6 22 13 15M15 26l1-8M3 14l8 1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a10 10 0 0 0-1.56 19.88v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.88h-2.34v7A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} role="img" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden className={cn("h-4 w-4", i <= rating ? "fill-amber-400 text-amber-400" : "text-navy/20")} />
      ))}
    </div>
  );
}
