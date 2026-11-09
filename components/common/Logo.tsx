import Image from "next/image";
import Link from "next/link";
import { cn, getSafeImageUrl } from "@/lib/utils";

/** Bear mark from the approved design. Used when no custom logo is uploaded. */
export function BearMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  const stroke = inverted ? "#FFFFFF" : "#0A3158";
  const face = inverted ? "#0A3158" : "#FFFFFF";
  return (
    <svg viewBox="0 0 72 64" className={className} aria-hidden>
      <circle cx="15" cy="15" r="10" fill={face} stroke={stroke} strokeWidth="3" />
      <circle cx="15" cy="15" r="4.5" fill="#F6C5CF" />
      <circle cx="57" cy="15" r="10" fill={face} stroke={stroke} strokeWidth="3" />
      <circle cx="57" cy="15" r="4.5" fill="#F6C5CF" />
      <ellipse cx="36" cy="36" rx="27" ry="24" fill={face} stroke={stroke} strokeWidth="3" />
      <circle cx="26" cy="33" r="2.8" fill={stroke} />
      <circle cx="46" cy="33" r="2.8" fill={stroke} />
      <ellipse cx="19" cy="42" rx="4.5" ry="3" fill="#F6C5CF" />
      <ellipse cx="53" cy="42" rx="4.5" ry="3" fill="#F6C5CF" />
      <ellipse cx="36" cy="42" rx="7.5" ry="6" fill={inverted ? "#0A3158" : "#FBE5EA"} stroke={stroke} strokeWidth="2" />
      <path d="M33.5 39.5h5l-2.5 2.5z" fill={stroke} />
      <path d="M33 45c1.6 1.4 4.4 1.4 6 0" stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  logoUrl,
  name = "BIAN&BRU",
  company = "INTERPAAB LLC",
  inverted = false,
  className,
}: {
  logoUrl?: string;
  name?: string;
  company?: string;
  inverted?: boolean;
  className?: string;
}) {
  const custom = logoUrl ? getSafeImageUrl(logoUrl, "") : "";
  return (
    <Link href="/" aria-label={`${name} — inicio`} className={cn("flex shrink-0 items-center gap-2.5", className)}>
      {custom ? (
        <Image src={custom} alt={name} width={220} height={64} className="h-12 w-auto object-contain sm:h-14" priority />
      ) : (
        <>
          <BearMark inverted={inverted} className="h-11 w-12 sm:h-14 sm:w-16" />
          <span className="flex flex-col leading-none">
            <span className={cn("font-serif text-[24px] font-semibold tracking-wide sm:text-[30px]", inverted ? "text-white" : "text-navy")}>
              {name}
            </span>
            <span className={cn("mt-1 text-[9px] tracking-[0.42em] sm:text-[11px]", inverted ? "text-white/80" : "text-navy/80")}>
              {company}
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
