/**
 * Default copy + editor field definitions for admin-managed content.
 * Safe to import on client and server (no DB access here).
 */

export const U = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  heroBaby: "/images/site/about-hero-v2.webp",
  babyTeddySleep: "/images/site/about-promesa-v2.webp",
  babyFeet: "/images/site/gallery-baby-feet-v2.webp",
  babyBlanket: "/images/site/hero-baby-v2.webp",
  babyEyes: U("1491013516836-7db643ee125a"),
  plushToys: "/images/site/services-hero-v2.webp",
  teddyBasket: "/images/site/gallery-teddy-basket-v2.webp",
  sleepingBaby: U("1544126592-807ade215a0b"),
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
};

export const ICON_OPTIONS_HELP = "Icon name: truck, award, heart, gift, shield, book, target, star, sparkles, baby";

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
        { icon: "truck", title: "Fast Shipping", subtitle: "Entrega rápida" },
        { icon: "award", title: "Quality & Care", subtitle: "Calidad y cuidado" },
        { icon: "heart", title: "Meaningful Keepsakes", subtitle: "Recuerdos que perduran" },
        { icon: "gift", title: "Thoughtfully Selected", subtitle: "Productos cuidadosamente elegidos" },
        { icon: "shield", title: "Secure Shopping", subtitle: "Compra segura" },
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
          text: "Bienvenido a un mundo donde los pequeños momentos se convierten en tesoros eternos. Ofrecemos recuerdos significativos y artículos esenciales para bebés, seleccionados con amor, cuidado y elegancia.",
          ctaLabel: "Learn More",
          ctaHref: "/about",
        },
        {
          icon: "book",
          title: "Our Story",
          text: "Nuestra historia comenzó con una simple creencia: los momentos más pequeños a menudo se convierten en nuestros mayores tesoros.",
          ctaLabel: "Read Our Story",
          ctaHref: "/about#historia",
        },
        {
          icon: "target",
          title: "Our Mission",
          text: "Celebrar la belleza de la primera infancia ofreciendo recuerdos cuidadosamente diseñados y artículos esenciales para bebés.",
          ctaLabel: "Our Mission",
          ctaHref: "/about#mision",
        },
        {
          icon: "shield",
          title: "Our Promise",
          text: "Cada pequeño detalle importa. Productos seleccionados con cuidado, diseñados con propósito y creados para traer belleza y significado a su familia.",
          ctaLabel: "Our Promise",
          ctaHref: "/about#promesa",
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
      heading: "Descuentos Especiales",
      text: "Aprovecha nuestras ofertas por tiempo limitado.",
      ctaLabel: "Ver Ofertas",
      ctaHref: "/shop?sort=discounted",
      image: "",
    },
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
      eyebrow: "Favoritos de las familias",
      heading: "Most Loved",
      text: "Los productos que más eligen padres y abuelos para celebrar los primeros momentos.",
      limit: 4,
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
      eyebrow: "Para toda la familia",
      heading: "Pensado para padres, abuelos y nuevos comienzos",
      text: "En BIAN&BRU creemos que cada detalle cuenta. Por eso seleccionamos productos suaves, seguros y llenos de significado, para que cada familia celebre los primeros capítulos de su bebé con amor.",
      image: IMG.family,
      points: [
        { icon: "heart", title: "Recuerdos para siempre", text: "Diarios, álbumes y marcos que guardan cada primera vez." },
        { icon: "award", title: "Calidad que se siente", text: "Materiales suaves y seguros, elegidos con cuidado." },
        { icon: "gift", title: "Listos para regalar", text: "Presentación elegante, ideal para baby showers y visitas." },
      ],
      ctaLabel: "Conoce nuestra historia",
      ctaHref: "/about",
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
      eyebrow: "Regalos con significado",
      heading: "El regalo perfecto para dar la bienvenida al bebé",
      text: "Sorprende a los nuevos padres con un detalle que se convertirá en recuerdo. Elige entre sets de accesorios, peluches, mantas y keepsakes listos para regalar.",
      image: IMG.giftPink,
      primaryLabel: "Shop Gifts",
      primaryHref: "/shop?sort=featured",
      secondaryLabel: "Need help choosing?",
      secondaryHref: "/booking",
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
      heading: "Comprar es fácil",
      steps: [
        { icon: "sparkles", title: "1. Elige", text: "Explora nuestras colecciones y encuentra el detalle perfecto." },
        { icon: "heart", title: "2. Personaliza", text: "Agrega un mensaje de regalo en tu pedido si lo deseas." },
        { icon: "shield", title: "3. Confirma", text: "Envía tu pedido y nuestro equipo te contacta para confirmar." },
        { icon: "truck", title: "4. Recibe", text: "Entrega rápida y cuidada directamente a tu puerta." },
      ],
    },
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
      heading: "Pequeños momentos, grandes recuerdos",
      text: "Síguenos en Instagram y comparte los momentos de tu bebé con BIAN&BRU.",
      images: [
        { src: IMG.babyBlanket, alt: "Bebé sonriendo con su osito y juguetes" },
        { src: IMG.momChild, alt: "Mamá abrazando a su bebé en la playa" },
        { src: IMG.babyFeet, alt: "Piecitos de bebé sobre una manta" },
        { src: IMG.teddyBasket, alt: "Osito y canasta con accesorios para bebé" },
        { src: IMG.babyTeddySleep, alt: "Bebé durmiendo con su osito" },
        { src: IMG.booking, alt: "Mamá con su bebé envuelto en una toalla" },
      ],
      ctaLabel: "Follow us on Instagram",
    },
  },
  {
    key: "home.testimonials",
    title: "Testimonials",
    group: "Home Page",
    previewPath: "/",
    fields: [{ name: "heading", label: "Heading", type: "text" }],
    defaults: { heading: "What Our Customers Say" },
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
    defaults: { heading: "Stay Connected", text: "Recibe novedades y descuentos exclusivos.", buttonLabel: "Subscribe" },
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
      heroTitle: "Bienvenido a BIAN&BRU.",
      heroText: "Bienvenido a un mundo donde los pequeños momentos se convierten en tesoros eternos.",
      heroImage: IMG.babyBlanket,
      storyTitle: "Nuestra Historia",
      storyText:
        "Nuestra historia comenzó con una simple creencia: los momentos más pequeños a menudo se convierten en nuestros mayores tesoros. Ofrecemos recuerdos significativos y artículos esenciales para bebés, seleccionados con amor, cuidado y elegancia.",
      storyImage: IMG.momChild,
      missionTitle: "Nuestra Misión",
      missionText:
        "Celebrar la belleza de la primera infancia ofreciendo recuerdos cuidadosamente diseñados y artículos esenciales para bebés.",
      promiseTitle: "Nuestra Promesa",
      promiseText:
        "Cada pequeño detalle importa. Productos seleccionados con cuidado, diseñados con propósito y creados para traer belleza y significado a su familia.",
      promiseImage: IMG.babyTeddySleep,
      whyTitle: "Why families choose us",
      whyItems: [
        { icon: "gift", title: "Gift-ready", text: "Keepsakes and essentials that are ready to give to new parents and grandparents." },
        { icon: "award", title: "Carefully curated", text: "Every product is selected for quality, softness and meaning." },
        { icon: "heart", title: "Made to be remembered", text: "Journals, albums and frames that keep the first chapters close." },
        { icon: "shield", title: "Shop with confidence", text: "Clear pricing, secure ordering and friendly support." },
      ],
      valuesTitle: "Nuestros Valores",
      values: [
        { title: "Amor", text: "Todo lo que elegimos está pensado para el vínculo familiar." },
        { title: "Cuidado", text: "Materiales suaves y seguros para los más pequeños." },
        { title: "Elegancia", text: "Diseños delicados que se convierten en recuerdos." },
      ],
      galleryImages: [{ src: IMG.babyFeet }, { src: IMG.teddyBasket }, { src: IMG.family }, { src: IMG.heroBaby }, { src: IMG.booking }, { src: IMG.giftPink }],
      ctaTitle: "Find something special for your little one",
      ctaLabel: "Explore Our Collections",
      ctaHref: "/shop",
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
      mainService: "Ventas de productos y accesorios para bebés.",
      intro: "From the first photo to everyday comfort, we help families find meaningful products for every little chapter.",
      heroImage: IMG.plushToys,
      items: [
        { icon: "book", title: "Keepsakes", text: "Baby journals, photo albums, footprint frames and memory books to treasure forever.", image: IMG.babyFeet, href: "/shop?collection=recuerdos-y-recuerdos" },
        { icon: "baby", title: "Baby Essentials", text: "Blankets, pillows, feeding accessories and plush toys for everyday care.", image: IMG.teddyBasket, href: "/shop?collection=baby-essentials" },
        { icon: "gift", title: "Gift-ready products", text: "Beautifully presented items, ideal for baby showers and new parents.", image: IMG.giftPink, href: "/shop?sort=featured" },
        { icon: "sparkles", title: "Curated collections", text: "Thoughtfully grouped products that work beautifully together.", image: IMG.plushToys, href: "/#collections" },
        { icon: "heart", title: "Family-focused products", text: "Pieces that parents and grandparents love to share with the little ones.", image: IMG.family, href: "/shop" },
        { icon: "star", title: "Special offers", text: "Seasonal discounts and limited-time offers on selected products.", image: IMG.babyTeddySleep, href: "/shop?sort=discounted" },
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
      promoTitle: "Descuentos hasta 20% OFF",
      promoText: "Aprovecha nuestras ofertas por tiempo limitado en productos seleccionados.",
      note: "All prices are shown in USD. Shipping and taxes are confirmed before your order is finalized.",
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
  newsletterText: "Recibe novedades y descuentos exclusivos.",
  seoTitle: "BIAN&BRU — Baby Keepsakes & Essentials",
  seoDescription:
    "Bienvenido a un mundo donde los pequeños momentos se convierten en tesoros eternos. Baby journals, photo albums, keepsakes and baby essentials.",
  ogImage: IMG.heroBaby,
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
  { name: "shippingMessage", label: "Shipping message", type: "text" },
  { name: "footerText", label: "Footer text", type: "textarea" },
  { name: "newsletterText", label: "Newsletter text", type: "textarea" },
  { name: "seoTitle", label: "Default SEO title", type: "text" },
  { name: "seoDescription", label: "Default SEO description", type: "textarea" },
  { name: "ogImage", label: "Default social share image", type: "image" },
];
