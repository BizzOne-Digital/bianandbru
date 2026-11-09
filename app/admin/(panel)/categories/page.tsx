"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { taxonomyColumns, taxonomyFields } from "@/components/admin/resource-configs";

export default function CategoriesAdmin() {
  return (
    <ResourceManager
      resource="categories"
      title="Categories"
      singular="Category"
      description="Product types used for shop filters (e.g. Journals, Blankets)."
      fields={taxonomyFields}
      columns={taxonomyColumns}
      folder="gallery"
      defaults={{ published: true }}
    />
  );
}
