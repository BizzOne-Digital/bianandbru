"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const REASONS = ["Gift recommendation", "Personalized keepsake", "Order question", "Bulk / event order", "Other"];

export function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    const errs: Record<string, string> = {};
    if (String(body.name || "").trim().length < 2) errs.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(String(body.email || ""))) errs.email = "Please enter a valid email";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send your request");
      setDone(true);
      form.reset();
      toast.success("Request sent. We will contact you soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your request");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="py-10 text-center" role="status">
        <CheckCircle2 aria-hidden className="mx-auto h-14 w-14 text-emerald-500" />
        <h2 className="mt-4 font-serif text-3xl">Thank you!</h2>
        <p className="mt-2 text-ink/80">Your request was received. Our team will contact you shortly.</p>
        <button type="button" className="btn-outline mt-6" onClick={() => setDone(false)}>
          Send another request
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
      <h2 className="font-serif text-2xl sm:col-span-2">Request an appointment</h2>
      <div>
        <label htmlFor="b-name" className="label">
          Name *
        </label>
        <input id="b-name" name="name" className="field" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="b-email" className="label">
          Email *
        </label>
        <input id="b-email" name="email" type="email" className="field" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="b-phone" className="label">
          Phone
        </label>
        <input id="b-phone" name="phone" type="tel" className="field" autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="b-reason" className="label">
          Reason
        </label>
        <select id="b-reason" name="reason" className="field" defaultValue={REASONS[0]}>
          {REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="b-date" className="label">
          Preferred date
        </label>
        <input id="b-date" name="preferredDate" type="date" min={today} className="field" />
      </div>
      <div>
        <label htmlFor="b-time" className="label">
          Preferred time
        </label>
        <input id="b-time" name="preferredTime" type="time" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="b-message" className="label">
          Message
        </label>
        <textarea id="b-message" name="message" rows={5} className="field" />
      </div>
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button type="submit" disabled={loading} className="btn-pink sm:col-span-2 sm:justify-self-start">
        {loading && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
        {loading ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
