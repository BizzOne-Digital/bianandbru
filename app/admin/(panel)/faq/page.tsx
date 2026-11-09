"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function FaqAdmin() {
  return (
    <ResourceManager
      resource="faqs"
      title="FAQs"
      singular="FAQ"
      fields={[
        { name: "question", label: "Question", type: "text", required: true },
        { name: "category", label: "Category", type: "text", help: "e.g. Orders, Shipping, Products" },
        { name: "answer", label: "Answer", type: "textarea", required: true },
        { name: "displayOrder", label: "Display order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
      columns={[
        { key: "question", label: "Question" },
        { key: "category", label: "Category", className: "hidden sm:table-cell" },
        { key: "displayOrder", label: "Order", className: "hidden md:table-cell" },
        { key: "published", label: "Published", kind: "published" },
      ]}
      defaults={{ published: true, category: "General" }}
    />
  );
}
