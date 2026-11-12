/**
 * Default copy + editor field definitions for admin-managed content.
 * English is the default language; `defaultsEs` holds the Spanish translation
 * of the translatable (text) fields. Safe to import on client and server.
 */

export const U = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  heroBaby: "/images/site/about-hero-v2.webp",
  babyTeddySleep: "/images/site/about-promesa-v2.webp",
  babyFeet: "/images/site/gallery-baby-feet-v2.webp",
  babyBlanket: "/images/site/hero-baby-v2.webp",
  plushToys: "/images/site/services-hero-v2.webp",
  teddyBasket: "/images/site/gallery-teddy-basket-v2.webp",
  momChild: "/images/site/about-historia-v2.webp",
  booking: "/images/site/booking-v2.webp",
  family: "/images/site/gallery-family-sofa-v2.webp",
  giftPink: "/images/site/pink-gift-box-v2.webp",
  avatar1: U("1438761681033-6461ffad8d80", 200),
  avatar2: U("1500648767791-00dcc994a43e", 200),
  avatar3: U("1494790108377-be9c29b29330", 200),
  avatar4: U("1507003211169-0a1dd7228f2d", 200),
  avatar5: "/images/site/team-founder-v2.webp",
};

export type FieldDef =
  | { name: string; label: string; type: "text" | "textarea" | "url" | "image" | "boolean" | "number"; help?: string }
  | { name: string; label: string; type: "list"; itemLabel: string; fields: FieldDef[]; help?: string };

export type SectionDef = {
  key: string;
  title: string;
  group: "Home Page" | "Pages" | "Site";
  previewPath: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  /** Spanish translation of text fields (lists are matched by position). */
  defaultsEs: Record<string, unknown>;
};

export const ICON_OPTIONS_HELP = "Icon name: truck, award, heart, gift, shield, book, target, star, sparkles, baby";

/** Only text fields are translated; images, links, switches and numbers are shared. */
export function isTranslatable(f: FieldDef) {
  if (f.name === "icon") return false; // icon names are shared, not translated
  return f.type === "text" || f.type === "textarea" || f.type === "list";
}

/** Field definitions limited to translatable (text) fields — used by the Spanish editor. */
export function translatableFields(fields: FieldDef[]): FieldDef[] {
  return fields.filter(isTranslatable).map((f) => (f.type === "list" ? { ...f, fields: translatableFields(f.fields) } : f));
}

/** Keeps only translatable values (used when saving the Spanish version). */
export function stripToTranslatable(fields: FieldDef[], data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (!isTranslatable(f)) continue;
    const v = data[f.name];
    if (f.type === "list") {
      out[f.name] = Array.isArray(v) ? v.map((item) => stripToTranslatable(f.fields, (item || {}) as Record<string, unknown>)) : [];
    } else out[f.name] = typeof v === "string" ? v : "";
  }
  return out;
}

/** Deep merge for translations: empty strings never override; arrays merge by index. */
export function mergeTranslation(base: unknown, over: unknown): unknown {
  if (over === undefined || over === null || over === "") return base;
  if (Array.isArray(base) && Array.isArray(over)) return base.map((b, i) => mergeTranslation(b, over[i]));
  if (base && typeof base === "object" && !Array.isArray(base) && over && typeof over === "object" && !Array.isArray(over)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = mergeTranslation(out[k], v);
    return out;
  }
  return over;
}

export const SECTIONS: SectionDef[] = [
  {
    key: "home.hero",
    title: "Hero",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "headline", label: "Headline", type: "text" },
      { name: "highlight", label: "Highlight (script line)", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "primaryLabel", label: "Primary CTA label", type: "text" },
      { name: "primaryHref", label: "Primary CTA link", type: "url" },
      { name: "secondaryLabel", label: "Secondary CTA label", type: "text" },
      { name: "secondaryHref", label: "Secondary CTA link", type: "url" },
      { name: "heroImage", label: "Hero image", type: "image" },
      { name: "backgroundImage", label: "Background image (optional)", type: "image" },
      { name: "badgeEnabled", label: "Show discount badge", type: "boolean" },
      { name: "badgeTitle", label: "Badge title", type: "text" },
      { name: "badgeSubtitle", label: "Badge subtitle", type: "text" },
      { name: "badgeValue", label: "Badge value", type: "text" },
      { name: "badgeSuffix", label: "Badge suffix", type: "text" },
    ],
    defaults: {
      eyebrow: "",
      headline: "Welcome to BIAN&BRU...",
      highlight: "Where little details become memories that last forever.",
      description: "Discover beautiful ways to celebrate, cherish, and accompany your baby's first chapters.",
      primaryLabel: "Shop Now",
      primaryHref: "/shop",
      secondaryLabel: "Our Collections",
      secondaryHref: "/#collections",
      heroImage: IMG.heroBaby,
      backgroundImage: "",
      badgeEnabled: true,
      badgeTitle: "Special Offers",
      badgeSubtitle: "Save up to",
      badgeValue: "20%",
      badgeSuffix: "OFF",
    },
    defaultsEs: {
      headline: "Bienvenido a BIAN&BRU...",
      highlight: "Donde los pequeños detalles se convierten en recuerdos para siempre.",
      description: "Descubre hermosas maneras de celebrar, atesorar y acompañar los primeros capítulos de tu bebé.",
      primaryLabel: "Comprar ahora",
      secondaryLabel: "Nuestras colecciones",
      badgeTitle: "Ofertas especiales",
      badgeSubtitle: "Descuentos hasta",
      badgeValue: "20%",
      badgeSuffix: "OFF",
    },
  },
  {
    key: "home.trust",
    title: "Trust Benefits",
    group: "Home Page",
    previewPath: "/",
    fields: [
      {
        name: "items",
        label: "Benefits",
        type: "list",
        itemLabel: "Benefit",
        help: ICON_OPTIONS_HELP,
        fields: [
          { name: "icon", label: "Icon", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "text" },
        ],
      },
    ],
    defaults: {
      items: [
        { icon: "truck", title: "Fast Shipping", subtitle: "Quick, careful delivery" },
        { icon: "award", title: "Quality & Care", subtitle: "Soft, safe materials" },
        { icon: "heart", title: "Meaningful Keepsakes", subtitle: "Memories that last" },
        { icon: "gift", title: "Thoughtfully Selected", subtitle: "Carefully chosen products" },
        { icon: "shield", title: "Secure Shopping", subtitle: "Shop with confidence" },
      ],
    },
    defaultsEs: {
      items: [
        { title: "Envío rápido", subtitle: "Entrega rápida y cuidada" },
        { title: "Calidad y cuidado", subtitle: "Materiales suaves y seguros" },
        { title: "Recuerdos con significado", subtitle: "Recuerdos que perduran" },
        { title: "Cuidadosamente elegidos", subtitle: "Productos seleccionados con amor" },
        { title: "Compra segura", subtitle: "Compra con confianza" },
      ],
    },
  },
  {
    key: "home.story",
    title: "About Cards",
    group: "Home Page",
    previewPath: "/",
    fields: [
      {
        name: "cards",
        label: "Cards",
        type: "list",
        itemLabel: "Card",
        help: ICON_OPTIONS_HELP,
        fields: [
          { name: "icon", label: "Icon", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
          { name: "ctaLabel", label: "Link label", type: "text" },
          { name: "ctaHref", label: "Link", type: "url" },
        ],
      },
    ],
    defaults: {
      cards: [
        {
          icon: "heart",
          title: "About BIAN&BRU",
          text: "Welcome to a world where little moments become timeless treasures. We offer meaningful keepsakes and baby essentials, selected with love, care and elegance.",
          ctaLabel: "Learn More",
          ctaHref: "/about",
        },
        {
          icon: "book",
          title: "Our Story",
          text: "Our story began with a simple belief: the smallest moments often become our greatest treasures.",
          ctaLabel: "Read Our Story",
          ctaHref: "/about#story",
        },
        {
          icon: "target",
          title: "Our Mission",
          text: "To celebrate the beauty of early childhood by offering thoughtfully designed keepsakes and baby essentials.",
          ctaLabel: "Our Mission",
          ctaHref: "/about#mission",
        },
        {
          icon: "shield",
          title: "Our Promise",
          text: "Every little detail matters. Products chosen with care, designed with purpose and created to bring beauty and meaning to your family.",
          ctaLabel: "Our Promise",
          ctaHref: "/about#promise",
        },
      ],
    },
    defaultsEs: {
      cards: [
        {
          title: "Sobre BIAN&BRU",
          text: "Bienvenido a un mundo donde los pequeños momentos se convierten en tesoros eternos. Ofrecemos recuerdos significativos y artículos esenciales para bebés, seleccionados con amor, cuidado y elegancia.",
          ctaLabel: "Conoce más",
        },
        {
          title: "Nuestra historia",
          text: "Nuestra historia comenzó con una simple creencia: los momentos más pequeños a menudo se convierten en nuestros mayores tesoros.",
          ctaLabel: "Lee nuestra historia",
        },
        {
          title: "Nuestra misión",
          text: "Celebrar la belleza de la primera infancia ofreciendo recuerdos cuidadosamente diseñados y artículos esenciales para bebés.",
          ctaLabel: "Nuestra misión",
        },
        {
          title: "Nuestra promesa",
          text: "Cada pequeño detalle importa. Productos seleccionados con cuidado, diseñados con propósito y creados para traer belleza y significado a su familia.",
          ctaLabel: "Nuestra promesa",
        },
      ],
    },
  },
  {
    key: "home.collections",
    title: "Collections",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "limit", label: "Number of collections shown", type: "number" },
    ],
    defaults: { heading: "Our Collections", limit: 2 },
    defaultsEs: { heading: "Nuestras colecciones" },
  },
  {
    key: "home.featured",
    title: "Featured Products",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "viewAllLabel", label: "View all label", type: "text" },
      { name: "limit", label: "Number of products", type: "number" },
    ],
    defaults: { heading: "Featured Products", viewAllLabel: "View All Products", limit: 3 },
    defaultsEs: { heading: "Productos destacados", viewAllLabel: "Ver todos los productos" },
  },
  {
    key: "home.offers",
    title: "Special Offers Panel",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "text", label: "Text", type: "textarea" },
      { name: "ctaLabel", label: "Button label", type: "text" },
      { name: "ctaHref", label: "Button link", type: "url" },
      { name: "image", label: "Gift image (optional)", type: "image" },
    ],
    defaults: {
      heading: "Special Discounts",
      text: "Enjoy our limited-time offers.",
      ctaLabel: "View Offers",
      ctaHref: "/shop?sort=discounted",
      image: "",
    },
    defaultsEs: { heading: "Descuentos especiales", text: "Aprovecha nuestras ofertas por tiempo limitado.", ctaLabel: "Ver ofertas" },
  },
  {
    key: "home.bestsellers",
    title: "Most Loved Products",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "text", label: "Intro text", type: "textarea" },
      { name: "limit", label: "Number of products", type: "number" },
    ],
    defaults: {
      eyebrow: "Family favorites",
      heading: "Most Loved",
      text: "The pieces parents and grandparents choose most to celebrate the very first moments.",
      limit: 4,
    },
    defaultsEs: {
      eyebrow: "Favoritos de las familias",
      heading: "Los más queridos",
      text: "Los productos que más eligen padres y abuelos para celebrar los primeros momentos.",
    },
  },
  {
    key: "home.why",
    title: "Why Choose Us (split)",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "text", label: "Text", type: "textarea" },
      { name: "image", label: "Image", type: "image" },
      {
        name: "points",
        label: "Points",
        type: "list",
        itemLabel: "Point",
        help: ICON_OPTIONS_HELP,
        fields: [
          { name: "icon", label: "Icon", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
        ],
      },
      { name: "ctaLabel", label: "Button label", type: "text" },
      { name: "ctaHref", label: "Button link", type: "url" },
    ],
    defaults: {
      eyebrow: "For the whole family",
      heading: "Made for parents, grandparents and new beginnings",
      text: "At BIAN&BRU we believe every detail matters. That is why we choose soft, safe and meaningful products, so every family can celebrate their baby's first chapters with love.",
      image: IMG.family,
      points: [
        { icon: "heart", title: "Memories forever", text: "Journals, albums and frames that keep every first moment." },
        { icon: "award", title: "Quality you can feel", text: "Soft, safe materials, chosen with care." },
        { icon: "gift", title: "Ready to gift", text: "Elegant presentation, perfect for baby showers and visits." },
      ],
      ctaLabel: "Read our story",
      ctaHref: "/about",
    },
    defaultsEs: {
      eyebrow: "Para toda la familia",
      heading: "Pensado para padres, abuelos y nuevos comienzos",
      text: "En BIAN&BRU creemos que cada detalle cuenta. Por eso seleccionamos productos suaves, seguros y llenos de significado, para que cada familia celebre los primeros capítulos de su bebé con amor.",
      points: [
        { title: "Recuerdos para siempre", text: "Diarios, álbumes y marcos que guardan cada primera vez." },
        { title: "Calidad que se siente", text: "Materiales suaves y seguros, elegidos con cuidado." },
        { title: "Listos para regalar", text: "Presentación elegante, ideal para baby showers y visitas." },
      ],
      ctaLabel: "Conoce nuestra historia",
    },
  },
  {
    key: "home.gift",
    title: "Gift Banner",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "text", label: "Text", type: "textarea" },
      { name: "image", label: "Image", type: "image" },
      { name: "primaryLabel", label: "Primary button", type: "text" },
      { name: "primaryHref", label: "Primary link", type: "url" },
      { name: "secondaryLabel", label: "Secondary button", type: "text" },
      { name: "secondaryHref", label: "Secondary link", type: "url" },
    ],
    defaults: {
      eyebrow: "Gifts with meaning",
      heading: "The perfect gift to welcome a new baby",
      text: "Surprise new parents with a gift that becomes a keepsake. Choose from accessory sets, plush toys, blankets and keepsakes, all ready to give.",
      image: IMG.giftPink,
      primaryLabel: "Shop Gifts",
      primaryHref: "/shop?sort=featured",
      secondaryLabel: "Need help choosing?",
      secondaryHref: "/booking",
    },
    defaultsEs: {
      eyebrow: "Regalos con significado",
      heading: "El regalo perfecto para dar la bienvenida al bebé",
      text: "Sorprende a los nuevos padres con un detalle que se convertirá en recuerdo. Elige entre sets de accesorios, peluches, mantas y recuerdos listos para regalar.",
      primaryLabel: "Ver regalos",
      secondaryLabel: "¿Necesitas ayuda para elegir?",
    },
  },
  {
    key: "home.steps",
    title: "How It Works",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      {
        name: "steps",
        label: "Steps",
        type: "list",
        itemLabel: "Step",
        help: ICON_OPTIONS_HELP,
        fields: [
          { name: "icon", label: "Icon", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
        ],
      },
    ],
    defaults: {
      heading: "Shopping is easy",
      steps: [
        { icon: "sparkles", title: "1. Choose", text: "Explore our collections and find the perfect piece." },
        { icon: "heart", title: "2. Personalize", text: "Add a gift message to your order if you like." },
        { icon: "shield", title: "3. Confirm", text: "Send your order and our team contacts you to confirm." },
        { icon: "truck", title: "4. Receive", text: "Fast, careful delivery straight to your door." },
      ],
    },
    defaultsEs: {
      heading: "Comprar es fácil",
      steps: [
        { title: "1. Elige", text: "Explora nuestras colecciones y encuentra el detalle perfecto." },
        { title: "2. Personaliza", text: "Agrega un mensaje de regalo en tu pedido si lo deseas." },
        { title: "3. Confirma", text: "Envía tu pedido y nuestro equipo te contacta para confirmar." },
        { title: "4. Recibe", text: "Entrega rápida y cuidada directamente a tu puerta." },
      ],
    },
  },
  {
    key: "home.testimonials",
    title: "Testimonials",
    group: "Home Page",
    previewPath: "/",
    fields: [{ name: "heading", label: "Heading", type: "text" }],
    defaults: { heading: "What Our Customers Say" },
    defaultsEs: { heading: "Lo que dicen nuestros clientes" },
  },
  {
    key: "home.gallery",
    title: "Moments Gallery",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "text", label: "Text", type: "textarea" },
      { name: "images", label: "Images", type: "list", itemLabel: "Image", fields: [{ name: "src", label: "Image", type: "image" }, { name: "alt", label: "Description", type: "text" }] },
      { name: "ctaLabel", label: "Button label", type: "text" },
    ],
    defaults: {
      heading: "Little moments, big memories",
      text: "Follow us on Instagram and share your baby's moments with BIAN&BRU.",
      images: [
        { src: IMG.babyBlanket, alt: "Smiling baby with teddy bear and toys" },
        { src: IMG.momChild, alt: "Mother hugging her baby at the beach" },
        { src: IMG.babyFeet, alt: "Baby feet on a soft blanket" },
        { src: IMG.teddyBasket, alt: "Teddy bear and basket with baby accessories" },
        { src: IMG.babyTeddySleep, alt: "Baby sleeping with a teddy bear" },
        { src: IMG.booking, alt: "Mother with her baby wrapped in a towel" },
      ],
      ctaLabel: "Follow us on Instagram",
    },
    defaultsEs: {
      heading: "Pequeños momentos, grandes recuerdos",
      text: "Síguenos en Instagram y comparte los momentos de tu bebé con BIAN&BRU.",
      images: [
        { alt: "Bebé sonriendo con su osito y juguetes" },
        { alt: "Mamá abrazando a su bebé en la playa" },
        { alt: "Piecitos de bebé sobre una manta" },
        { alt: "Osito y canasta con accesorios para bebé" },
        { alt: "Bebé durmiendo con su osito" },
        { alt: "Mamá con su bebé envuelto en una toalla" },
      ],
      ctaLabel: "Síguenos en Instagram",
    },
  },
  {
    key: "home.newsletter",
    title: "Newsletter",
    group: "Home Page",
    previewPath: "/",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "text", label: "Text", type: "textarea" },
      { name: "buttonLabel", label: "Button label", type: "text" },
    ],
    defaults: { heading: "Stay Connected", text: "Get news and exclusive discounts.", buttonLabel: "Subscribe" },
    defaultsEs: { heading: "Mantente en contacto", text: "Recibe novedades y descuentos exclusivos.", buttonLabel: "Suscribirme" },
  },
  {
    key: "about",
    title: "About Page",
    group: "Pages",
    previewPath: "/about",
    fields: [
      { name: "heroTitle", label: "Hero title", type: "text" },
      { name: "heroText", label: "Hero text", type: "textarea" },
      { name: "heroImage", label: "Hero image", type: "image" },
      { name: "storyTitle", label: "Story title", type: "text" },
      { name: "storyText", label: "Story text", type: "textarea" },
      { name: "storyImage", label: "Story image", type: "image" },
      { name: "missionTitle", label: "Mission title", type: "text" },
      { name: "missionText", label: "Mission text", type: "textarea" },
      { name: "promiseTitle", label: "Promise title", type: "text" },
      { name: "promiseText", label: "Promise text", type: "textarea" },
      { name: "promiseImage", label: "Promise image", type: "image" },
      { name: "whyTitle", label: "Why families choose us — title", type: "text" },
      {
        name: "whyItems",
        label: "Why families choose us",
        type: "list",
        itemLabel: "Reason",
        help: ICON_OPTIONS_HELP,
        fields: [
          { name: "icon", label: "Icon", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
        ],
      },
      { name: "valuesTitle", label: "Brand values title", type: "text" },
      {
        name: "values",
        label: "Brand values",
        type: "list",
        itemLabel: "Value",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
        ],
      },
      { name: "galleryImages", label: "Lifestyle images", type: "list", itemLabel: "Image", fields: [{ name: "src", label: "Image", type: "image" }] },
      { name: "ctaTitle", label: "CTA title", type: "text" },
      { name: "ctaLabel", label: "CTA button", type: "text" },
      { name: "ctaHref", label: "CTA link", type: "url" },
    ],
    defaults: {
      heroTitle: "Welcome to BIAN&BRU.",
      heroText: "Welcome to a world where little moments become timeless treasures.",
      heroImage: IMG.babyBlanket,
      storyTitle: "Our Story",
      storyText:
        "Our story began with a simple belief: the smallest moments often become our greatest treasures. We offer meaningful keepsakes and baby essentials, selected with love, care and elegance.",
      storyImage: IMG.momChild,
      missionTitle: "Our Mission",
      missionText: "To celebrate the beauty of early childhood by offering thoughtfully designed keepsakes and baby essentials.",
      promiseTitle: "Our Promise",
      promiseText:
        "Every little detail matters. Products chosen with care, designed with purpose and created to bring beauty and meaning to your family.",
      promiseImage: IMG.babyTeddySleep,
      whyTitle: "Why families choose us",
      whyItems: [
        { icon: "gift", title: "Gift-ready", text: "Keepsakes and essentials that are ready to give to new parents and grandparents." },
        { icon: "award", title: "Carefully curated", text: "Every product is selected for quality, softness and meaning." },
        { icon: "heart", title: "Made to be remembered", text: "Journals, albums and frames that keep the first chapters close." },
        { icon: "shield", title: "Shop with confidence", text: "Clear pricing, secure ordering and friendly support." },
      ],
      valuesTitle: "Our Values",
      values: [
        { title: "Love", text: "Everything we choose is made for family bonds." },
        { title: "Care", text: "Soft, safe materials for the little ones." },
        { title: "Elegance", text: "Delicate designs that become keepsakes." },
      ],
      galleryImages: [{ src: IMG.babyFeet }, { src: IMG.teddyBasket }, { src: IMG.family }, { src: IMG.heroBaby }, { src: IMG.booking }, { src: IMG.giftPink }],
      ctaTitle: "Find something special for your little one",
      ctaLabel: "Explore Our Collections",
      ctaHref: "/shop",
    },
    defaultsEs: {
      heroTitle: "Bienvenido a BIAN&BRU.",
      heroText: "Bienvenido a un mundo donde los pequeños momentos se convierten en tesoros eternos.",
      storyTitle: "Nuestra historia",
      storyText:
        "Nuestra historia comenzó con una simple creencia: los momentos más pequeños a menudo se convierten en nuestros mayores tesoros. Ofrecemos recuerdos significativos y artículos esenciales para bebés, seleccionados con amor, cuidado y elegancia.",
      missionTitle: "Nuestra misión",
      missionText: "Celebrar la belleza de la primera infancia ofreciendo recuerdos cuidadosamente diseñados y artículos esenciales para bebés.",
      promiseTitle: "Nuestra promesa",
      promiseText:
        "Cada pequeño detalle importa. Productos seleccionados con cuidado, diseñados con propósito y creados para traer belleza y significado a su familia.",
      whyTitle: "Por qué las familias nos eligen",
      whyItems: [
        { title: "Listos para regalar", text: "Recuerdos y artículos esenciales listos para regalar a nuevos padres y abuelos." },
        { title: "Cuidadosamente elegidos", text: "Cada producto se selecciona por su calidad, suavidad y significado." },
        { title: "Hechos para recordar", text: "Diarios, álbumes y marcos que guardan los primeros capítulos." },
        { title: "Compra con confianza", text: "Precios claros, pedidos seguros y atención amable." },
      ],
      valuesTitle: "Nuestros valores",
      values: [
        { title: "Amor", text: "Todo lo que elegimos está pensado para el vínculo familiar." },
        { title: "Cuidado", text: "Materiales suaves y seguros para los más pequeños." },
        { title: "Elegancia", text: "Diseños delicados que se convierten en recuerdos." },
      ],
      ctaTitle: "Encuentra algo especial para tu pequeño",
      ctaLabel: "Explora nuestras colecciones",
    },
  },
  {
    key: "services",
    title: "Services Page",
    group: "Pages",
    previewPath: "/services",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "mainService", label: "Main service", type: "text" },
      { name: "intro", label: "Intro", type: "textarea" },
      { name: "heroImage", label: "Hero image", type: "image" },
      {
        name: "items",
        label: "Service sections",
        type: "list",
        itemLabel: "Section",
        help: ICON_OPTIONS_HELP,
        fields: [
          { name: "icon", label: "Icon", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
          { name: "image", label: "Image", type: "image" },
          { name: "href", label: "Link", type: "url" },
        ],
      },
    ],
    defaults: {
      heading: "Our Services",
      mainService: "Baby products and accessories, thoughtfully selected.",
      intro: "From the first photo to everyday comfort, we help families find meaningful products for every little chapter.",
      heroImage: IMG.plushToys,
      items: [
        { icon: "book", title: "Keepsakes", text: "Baby journals, photo albums, footprint frames and memory books to treasure forever.", image: IMG.babyFeet, href: "/shop?collection=recuerdos-y-recuerdos" },
        { icon: "baby", title: "Baby Essentials", text: "Blankets, pillows, feeding accessories and plush toys for everyday care.", image: IMG.teddyBasket, href: "/shop?collection=baby-essentials" },
        { icon: "gift", title: "Gift-ready products", text: "Beautifully presented items, ideal for baby showers and new parents.", image: IMG.giftPink, href: "/shop?sort=featured" },
        { icon: "sparkles", title: "Curated collections", text: "Thoughtfully grouped products that work beautifully together.", image: IMG.babyBlanket, href: "/#collections" },
        { icon: "heart", title: "Family-focused products", text: "Pieces that parents and grandparents love to share with the little ones.", image: IMG.family, href: "/shop" },
        { icon: "star", title: "Special offers", text: "Seasonal discounts and limited-time offers on selected products.", image: IMG.babyTeddySleep, href: "/shop?sort=discounted" },
      ],
    },
    defaultsEs: {
      heading: "Nuestros servicios",
      mainService: "Venta de productos y accesorios para bebés.",
      intro: "Desde la primera foto hasta la comodidad diaria, ayudamos a las familias a encontrar productos con significado para cada pequeño capítulo.",
      items: [
        { title: "Recuerdos", text: "Diarios de bebé, álbumes de fotos, marcos de huellas y libros de recuerdos para atesorar siempre." },
        { title: "Esenciales para bebé", text: "Mantas, almohadas, accesorios de alimentación y peluches para el cuidado diario." },
        { title: "Listos para regalar", text: "Artículos bellamente presentados, ideales para baby showers y nuevos padres." },
        { title: "Colecciones seleccionadas", text: "Productos agrupados con cuidado que combinan a la perfección." },
        { title: "Pensados para la familia", text: "Piezas que padres y abuelos disfrutan compartir con los más pequeños." },
        { title: "Ofertas especiales", text: "Descuentos de temporada y ofertas por tiempo limitado en productos seleccionados." },
      ],
    },
  },
  {
    key: "pricing",
    title: "Pricing Page",
    group: "Pages",
    previewPath: "/pricing",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "intro", label: "Intro", type: "textarea" },
      { name: "promoTitle", label: "Promotion title", type: "text" },
      { name: "promoText", label: "Promotion text", type: "textarea" },
      { name: "note", label: "Pricing note", type: "textarea" },
    ],
    defaults: {
      heading: "Pricing",
      intro: "Transparent prices on every product. Discounts are applied automatically and shown on each item.",
      promoTitle: "Save up to 20% OFF",
      promoText: "Enjoy our limited-time offers on selected products.",
      note: "All prices are shown in USD. Shipping and taxes are confirmed before your order is finalized.",
    },
    defaultsEs: {
      heading: "Precios",
      intro: "Precios transparentes en cada producto. Los descuentos se aplican automáticamente y se muestran en cada artículo.",
      promoTitle: "Descuentos hasta 20% OFF",
      promoText: "Aprovecha nuestras ofertas por tiempo limitado en productos seleccionados.",
      note: "Todos los precios están en USD. El envío y los impuestos se confirman antes de finalizar tu pedido.",
    },
  },
  {
    key: "pages.misc",
    title: "Page Headings",
    group: "Pages",
    previewPath: "/team",
    fields: [
      { name: "teamHeading", label: "Team page heading", type: "text" },
      { name: "teamIntro", label: "Team page intro", type: "textarea" },
      { name: "faqHeading", label: "FAQ heading", type: "text" },
      { name: "faqIntro", label: "FAQ intro", type: "textarea" },
      { name: "testimonialsHeading", label: "Testimonials heading", type: "text" },
      { name: "testimonialsIntro", label: "Testimonials intro", type: "textarea" },
      { name: "bookingHeading", label: "Booking heading", type: "text" },
      { name: "bookingIntro", label: "Booking intro", type: "textarea" },
      { name: "bookingImage", label: "Booking image", type: "image" },
      { name: "shopHeading", label: "Shop heading", type: "text" },
      { name: "shopIntro", label: "Shop intro", type: "textarea" },
    ],
    defaults: {
      teamHeading: "Our Team",
      teamIntro: "The people who carefully select every keepsake and essential.",
      faqHeading: "Frequently Asked Questions",
      faqIntro: "Answers to the questions families ask us most.",
      testimonialsHeading: "What Our Customers Say",
      testimonialsIntro: "Real words from the families we serve.",
      bookingHeading: "Book a Consultation",
      bookingIntro: "Need help choosing a gift or a personalized keepsake? Send us a request and we will contact you.",
      bookingImage: IMG.booking,
      shopHeading: "Shop",
      shopIntro: "Keepsakes and essentials, chosen with love.",
    },
    defaultsEs: {
      teamHeading: "Nuestro equipo",
      teamIntro: "Las personas que seleccionan con cuidado cada recuerdo y artículo esencial.",
      faqHeading: "Preguntas frecuentes",
      faqIntro: "Respuestas a las preguntas que más nos hacen las familias.",
      testimonialsHeading: "Lo que dicen nuestros clientes",
      testimonialsIntro: "Palabras reales de las familias que atendemos.",
      bookingHeading: "Agenda una consulta",
      bookingIntro: "¿Necesitas ayuda para elegir un regalo o un recuerdo personalizado? Envíanos tu solicitud y te contactaremos.",
      shopHeading: "Tienda",
      shopIntro: "Recuerdos y artículos esenciales, elegidos con amor.",
    },
  },
];

export const SECTION_MAP = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));

export type SiteSettingsData = {
  businessName: string;
  companyName: string;
  logo: string;
  favicon: string;
  email: string;
  footerEmail: string;
  phone: string;
  instagram: string;
  facebook: string;
  address: string;
  currency: string;
  announcement: string;
  shippingMessage: string;
  footerText: string;
  newsletterText: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  announcementEs: string;
  shippingMessageEs: string;
  footerTextEs: string;
  newsletterTextEs: string;
  seoTitleEs: string;
  seoDescriptionEs: string;
};

export const SETTINGS_DEFAULTS: SiteSettingsData = {
  businessName: "BIAN&BRU",
  companyName: "INTERPAAB LLC",
  logo: "",
  favicon: "",
  email: "lbpaa26@gmail.com",
  footerEmail: "Interpaab@gmail.com",
  phone: "8018973093",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  address: "",
  currency: "USD",
  announcement: "INTERPAAB LLC (Bian&Bru)",
  shippingMessage: "Fast shipping on every order",
  footerText: "Where little details become memories that last forever.",
  newsletterText: "Get news and exclusive discounts.",
  seoTitle: "BIAN&BRU — Baby Keepsakes & Essentials",
  seoDescription:
    "Welcome to a world where little moments become timeless treasures. Baby journals, photo albums, keepsakes and baby essentials.",
  ogImage: IMG.heroBaby,
  announcementEs: "",
  shippingMessageEs: "Envío rápido en cada pedido",
  footerTextEs: "Donde los pequeños detalles se convierten en recuerdos para siempre.",
  newsletterTextEs: "Recibe novedades y descuentos exclusivos.",
  seoTitleEs: "BIAN&BRU — Recuerdos y artículos esenciales para bebés",
  seoDescriptionEs:
    "Bienvenido a un mundo donde los pequeños momentos se convierten en tesoros eternos. Diarios de bebé, álbumes de fotos, recuerdos y artículos esenciales.",
};

export const SETTINGS_FIELDS: FieldDef[] = [
  { name: "businessName", label: "Business name", type: "text" },
  { name: "companyName", label: "Company name", type: "text" },
  { name: "logo", label: "Logo (leave empty for built-in bear logo)", type: "image" },
  { name: "favicon", label: "Favicon", type: "image" },
  { name: "email", label: "Header email", type: "text" },
  { name: "footerEmail", label: "Footer email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "instagram", label: "Instagram URL", type: "url" },
  { name: "facebook", label: "Facebook URL", type: "url" },
  { name: "address", label: "Address", type: "textarea" },
  { name: "currency", label: "Currency (ISO code)", type: "text" },
  { name: "announcement", label: "Top bar text", type: "text" },
  { name: "announcementEs", label: "Top bar text — Spanish (optional)", type: "text" },
  { name: "shippingMessage", label: "Shipping message", type: "text" },
  { name: "shippingMessageEs", label: "Shipping message — Spanish", type: "text" },
  { name: "footerText", label: "Footer text", type: "textarea" },
  { name: "footerTextEs", label: "Footer text — Spanish", type: "textarea" },
  { name: "newsletterText", label: "Newsletter text", type: "textarea" },
  { name: "newsletterTextEs", label: "Newsletter text — Spanish", type: "textarea" },
  { name: "seoTitle", label: "Default SEO title", type: "text" },
  { name: "seoTitleEs", label: "Default SEO title — Spanish", type: "text" },
  { name: "seoDescription", label: "Default SEO description", type: "textarea" },
  { name: "seoDescriptionEs", label: "Default SEO description — Spanish", type: "textarea" },
  { name: "ogImage", label: "Default social share image", type: "image" },
];

/** Applies the Spanish variants of settings text when the site is in Spanish. */
export function localizeSettings(s: SiteSettingsData, lang: "en" | "es"): SiteSettingsData {
  if (lang !== "es") return s;
  const pickEs = (en: string, es: string) => (es && es.trim() ? es : en);
  return {
    ...s,
    announcement: pickEs(s.announcement, s.announcementEs),
    shippingMessage: pickEs(s.shippingMessage, s.shippingMessageEs),
    footerText: pickEs(s.footerText, s.footerTextEs),
    newsletterText: pickEs(s.newsletterText, s.newsletterTextEs),
    seoTitle: pickEs(s.seoTitle, s.seoTitleEs),
    seoDescription: pickEs(s.seoDescription, s.seoDescriptionEs),
  };
}
