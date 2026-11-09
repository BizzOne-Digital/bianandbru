"use client";

import { SectionEditor } from "@/components/admin/SectionEditor";
import { PageHeader } from "@/components/admin/ui";
import { SETTINGS_FIELDS } from "@/lib/content-defaults";

export default function SettingsAdmin() {
  return (
    <>
      <PageHeader title="Site Settings" description="Business details, contact info, header/footer text, social links, logo and default SEO." />
      <SectionEditor sectionKey="settings" title="Settings" fields={SETTINGS_FIELDS} previewPath="/" showPublish={false} folder="misc" />
    </>
  );
}
