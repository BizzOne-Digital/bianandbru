import Link from "next/link";
import { HeartLine } from "./Icons";

export function EmptyState({
  title,
  text,
  actionLabel,
  actionHref,
  tone = "pink",
}: {
  title: string;
  text?: string;
  actionLabel?: string;
  actionHref?: string;
  tone?: "pink" | "blue";
}) {
  return (
    <div className={`mx-auto max-w-xl rounded-[24px] px-6 py-12 text-center ${tone === "pink" ? "bg-blush-soft/70" : "bg-baby/60"}`}>
      <HeartLine className="mx-auto h-10 w-12" />
      <h2 className="mt-4 font-serif text-2xl text-navy">{title}</h2>
      {text && <p className="mt-2 text-ink/75">{text}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-navy mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
