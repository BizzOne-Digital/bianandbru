"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { useLang } from "@/components/common/LangProvider";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  const { t } = useLang();
  return (
    <div className="container-x py-16">
      <EmptyState title={t("error.title")} text={t("error.text")} />
      <div className="mt-6 text-center">
        <button type="button" onClick={reset} className="btn-navy">
          {t("error.retry")}
        </button>
      </div>
    </div>
  );
}
