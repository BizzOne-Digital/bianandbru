"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function TeamAdmin() {
  return (
    <ResourceManager
      resource="team"
      title="Team Members"
      singular="Team member"
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text" },
        { name: "bio", label: "Bio", type: "textarea" },
        { name: "photo", label: "Photo", type: "image" },
        { name: "displayOrder", label: "Display order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
      columns={[
        { key: "photo", label: "", kind: "image", className: "w-16" },
        { key: "name", label: "Name" },
        { key: "role", label: "Role", className: "hidden md:table-cell" },
        { key: "displayOrder", label: "Order", className: "hidden sm:table-cell" },
        { key: "published", label: "Published", kind: "published" },
      ]}
      folder="pages"
      defaults={{ published: true }}
    />
  );
}
