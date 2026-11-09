"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function OffersAdmin() {
  return (
    <ResourceManager
      resource="offers"
      title="Special Offers"
      singular="Offer"
      description="Promotions shown on the Pricing page. Product discounts are set per product via “Compare-at price”. The homepage promo panel and hero badge are edited under Home & Pages."
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "discountLabel", label: "Discount label", type: "text", help: "e.g. -20%" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "ctaLabel", label: "Button label", type: "text" },
        { name: "ctaHref", label: "Button link", type: "text", help: "Internal path, e.g. /shop?sort=discounted" },
        { name: "image", label: "Banner image", type: "image" },
        { name: "displayOrder", label: "Display order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
      columns={[
        { key: "image", label: "", kind: "image", className: "w-16" },
        { key: "title", label: "Title" },
        { key: "discountLabel", label: "Discount", className: "hidden sm:table-cell" },
        { key: "published", label: "Published", kind: "published" },
      ]}
      folder="pages"
      defaults={{ published: true, ctaLabel: "Ver Ofertas", ctaHref: "/shop?sort=discounted" }}
    />
  );
}
