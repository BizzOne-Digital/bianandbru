"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function TestimonialsAdmin() {
  return (
    <ResourceManager
      resource="testimonials"
      title="Testimonials"
      singular="Testimonial"
      description="Featured testimonials appear first on the homepage."
      fields={[
        { name: "name", label: "Customer name", type: "text", required: true },
        { name: "location", label: "City / location", type: "text" },
        { name: "rating", label: "Rating", type: "rating" },
        { name: "displayOrder", label: "Display order", type: "number" },
        { name: "review", label: "Review", type: "textarea", required: true },
        { name: "photo", label: "Customer photo", type: "image" },
        { name: "published", label: "Published", type: "boolean" },
        { name: "featured", label: "Featured", type: "boolean" },
      ]}
      columns={[
        { key: "photo", label: "", kind: "image", className: "w-16" },
        { key: "name", label: "Name" },
        { key: "review", label: "Review", className: "hidden md:table-cell" },
        { key: "rating", label: "Rating", kind: "stars", className: "hidden sm:table-cell" },
        { key: "featured", label: "Featured", kind: "featured" },
        { key: "published", label: "Published", kind: "published" },
      ]}
      folder="pages"
      defaults={{ published: true, rating: 5 }}
    />
  );
}
