import type { AdminField } from "./FieldRenderer";
import type { Column } from "./ResourceManager";

export const taxonomyFields: AdminField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "slug", label: "Slug", type: "slug", required: true, help: "Lowercase, dashes only. Leave empty to generate from name." },
  { name: "description", label: "Description", type: "textarea" },
  { name: "image", label: "Image", type: "image" },
  { name: "displayOrder", label: "Display order", type: "number" },
  { name: "published", label: "Published", type: "boolean" },
];

export const taxonomyColumns: Column[] = [
  { key: "image", label: "", kind: "image", className: "w-16" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug", className: "hidden md:table-cell" },
  { key: "displayOrder", label: "Order", className: "hidden sm:table-cell" },
  { key: "published", label: "Published", kind: "published" },
];
