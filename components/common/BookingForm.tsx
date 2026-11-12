"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/components/common/LangProvider";
import type { DictKey } from "@/lib/i18n";

// Stored value stays in English for the admin; the label is translated.
const REASONS: { value: string; key: DictKey }[] = [
  { value: "Gift recommendation", key: "booking.reason.gift" },
  { value: "Personalized keepsake", key: "booking.reason.keepsake" },
  { value: "Order question", key: "booking.reason.order" },
  { value: "Bulk / event order", key: "booking.reason.bulk" },
  { value: "Other", key: "booking.reason.other" },
];

export function BookingForm() {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    const errs: Record<string, string> = {};
    if (String(body.name || "").trim().length < 2) errs.name = t("booking.errName");
    if (!/^\S+@\S+\.\S+$/.test(String(body.email || ""))) errs.email = t("booking.errEmail");
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("error.title"));
      setDone(true);
      form.reset();
      toast.success(t("booking.sent"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("error.title"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="py-10 text-center" role="status">
        <CheckCircle2 aria-hidden className="mx-auto h-14 w-14 text-emerald-500" />
        <h2 className="mt-4 font-serif text-3xl">{t("booking.thanks")}</h2>
        <p className="mt-2 text-ink/80">{t("booking.received")}</p>
        <button type="button" className="btn-outline mt-6" onClick={() => setDone(false)}>
          {t("booking.another")}
        </button>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1 text-sm text-red-600">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <h2 className="font-serif text-2xl sm:col-span-2">{t("booking.formTitle")}</h2>
      <div>
        <label htmlFor="b-name" className="label">
          {t("booking.name")} *
        </label>
        <input id="b-name" name="name" className="field" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="b-email" className="label">
          {t("booking.email")} *
        </label>
        <input id="b-email" name="email" type="email" className="field" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="b-phone" className="label">
          {t("booking.phone")}
        </label>
        <input id="b-phone" name="phone" type="tel" className="field" autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="b-reason" className="label">
          {t("booking.reason")}
        </label>
        <select id="b-reason" name="reason" className="field" defaultValue={REASONS[0].value}>
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {t(r.key)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="b-date" className="label">
          {t("booking.date")}
        </label>
        <input id="b-date" name="preferredDate" type="date" min={today} className="field" />
      </div>
      <div>
        <label htmlFor="b-time" className="label">
          {t("booking.time")}
        </label>
        <input id="b-time" name="preferredTime" type="time" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="b-message" className="label">
          {t("booking.message")}
        </label>
        <textarea id="b-message" name="message" rows={5} className="field" />
      </div>
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button type="submit" disabled={loading} className="btn-pink sm:col-span-2 sm:justify-self-start">
        {loading && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
        {loading ? t("booking.sending") : t("booking.send")}
      </button>
    </form>
  );
}
