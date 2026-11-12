"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo, useTransition } from "react";
import { LANG_COOKIE, makeT, type Lang, type T } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const Ctx = createContext<{ lang: Lang; t: T }>({ lang: "en", t: makeT("en") });

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const value = useMemo(() => ({ lang, t: makeT(lang) }), [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

/** EN | ES toggle. Stores the choice in a cookie and re-renders server content. */
export function LangSwitcher({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { lang, t } = useLang();
  const router = useRouter();
  const [pending, start] = useTransition();

  const set = (l: Lang) => {
    if (l === lang) return;
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = l;
    start(() => router.refresh());
  };

  return (
    <div role="group" aria-label={t("lang.label")} className={cn("inline-flex items-center rounded-full p-0.5 text-xs font-bold", tone === "dark" ? "bg-white/10" : "bg-navy/5", pending && "opacity-60", className)}>
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => set(l)}
          aria-pressed={lang === l}
          lang={l}
          aria-label={l === "en" ? "English" : "Español"}
          className={cn(
            "min-h-7 min-w-9 rounded-full px-2.5 py-1 uppercase transition",
            lang === l ? (tone === "dark" ? "bg-white text-navy" : "bg-navy text-white") : tone === "dark" ? "text-white/80 hover:text-white" : "text-navy/70 hover:text-navy"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
