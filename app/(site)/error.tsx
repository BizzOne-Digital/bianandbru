"use client";

import { EmptyState } from "@/components/common/EmptyState";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x py-16">
      <EmptyState title="Something went wrong" text="We could not load this page right now. Please try again." />
      <div className="mt-6 text-center">
        <button type="button" onClick={reset} className="btn-navy">
          Try again
        </button>
      </div>
    </div>
  );
}
