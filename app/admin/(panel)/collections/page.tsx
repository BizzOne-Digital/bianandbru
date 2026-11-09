"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { taxonomyColumns, taxonomyFields } from "@/components/admin/resource-configs";

export default function CollectionsAdmin() {
  return (
    <ResourceManager
      resource="collections"
      title="Collections"
      singular="Collection"
      description="Curated groups shown in “Our Collections” on the homepage. Lower display order shows first."
      fields={[...taxonomyFields.slice(0, 5), { name: "featured", label: "Featured", type: "boolean" }, taxonomyFields[5]]}
      columns={[...taxonomyColumns.slice(0, 4), { key: "featured", label: "Featured", kind: "featured" }, taxonomyColumns[4]]}
      folder="gallery"
      defaults={{ published: true }}
    />
  );
}
