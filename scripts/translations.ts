/**
 * English-first catalog copy with Spanish translations.
 * Used by `npm run seed` (new databases) and `npm run translate` (existing databases).
 */

export const PRODUCT_COPY: Record<
  string,
  { name: string; shortDescription: string; description: string; nameEs: string; shortDescriptionEs: string; descriptionEs: string; keywords: string[] }
> = {
  "diario-del-bebe": {
    name: "Baby Journal",
    shortDescription: "A journal to keep every first moment.",
    description:
      "Record your baby's first steps, first words and special moments. Guided pages, space for photos and a soft pastel cover.\n\nA perfect gift for new parents and grandparents.",
    nameEs: "Diario del Bebé",
    shortDescriptionEs: "Un diario para guardar cada primer momento.",
    descriptionEs:
      "Registra los primeros pasos, palabras y momentos especiales de tu bebé. Páginas guiadas, espacio para fotos y una portada suave en tonos pastel.\n\nIdeal como regalo para nuevos padres y abuelos.",
    keywords: ["journal", "diario", "memory book", "gift", "regalo"],
  },
  "set-de-accesorios-para-bebe": {
    name: "Baby Accessory Gift Set",
    shortDescription: "A soft accessory set, ready to gift.",
    description: "A set of essential baby accessories with plush toys and soft textiles, presented in a gift-ready box.",
    nameEs: "Set de Accesorios para Bebé",
    shortDescriptionEs: "Set suave de accesorios listo para regalar.",
    descriptionEs: "Un set de accesorios esenciales con peluches y textiles suaves, presentado en una caja lista para regalar.",
    keywords: ["set", "accessories", "accesorios", "gift", "regalo"],
  },
  "album-de-fotos-del-bebe": {
    name: "Baby Photo Album",
    shortDescription: "A photo album for baby's first year.",
    description: "An elegant album with a page for every month of the first year, space for the ultrasound and personal notes.",
    nameEs: "Álbum de Fotos del Bebé",
    shortDescriptionEs: "Álbum de fotos para el primer año.",
    descriptionEs: "Un álbum elegante con páginas para cada mes del primer año, espacio para la ecografía y notas personales.",
    keywords: ["album", "photo", "fotos", "keepsake", "recuerdo"],
  },
  "manta-suave-de-algodon": {
    name: "Soft Cotton Blanket",
    shortDescription: "A soft, breathable knit blanket.",
    description: "A pastel knit cotton blanket, perfect for the crib, the stroller or as a gift.",
    nameEs: "Manta Suave de Algodón",
    shortDescriptionEs: "Manta tejida, suave y transpirable.",
    descriptionEs: "Manta de algodón tejida en tonos pastel, perfecta para la cuna, el cochecito o como regalo.",
    keywords: ["blanket", "manta", "cotton", "algodón"],
  },
  "osito-de-peluche-clasico": {
    name: "Classic Teddy Bear",
    shortDescription: "Your baby's very first friend.",
    description: "A soft plush teddy bear with embroidered details. A classic companion for every nap.",
    nameEs: "Osito de Peluche Clásico",
    shortDescriptionEs: "El primer amigo de tu bebé.",
    descriptionEs: "Osito de peluche suave con detalles bordados. Un compañero clásico que acompaña cada siesta.",
    keywords: ["teddy", "plush", "peluche", "osito"],
  },
  "marco-de-huellas-del-bebe": {
    name: "Baby Footprint Frame",
    shortDescription: "Keep those first footprints forever.",
    description: "A frame with a baby-safe footprint kit and space for a photo. A keepsake that lasts a lifetime.",
    nameEs: "Marco de Huellas del Bebé",
    shortDescriptionEs: "Guarda las primeras huellas para siempre.",
    descriptionEs: "Marco con kit de huellas seguro para bebés y espacio para una foto. Un recuerdo que dura toda la vida.",
    keywords: ["frame", "footprint", "marco", "huellas"],
  },
};

export const COLLECTION_COPY: Record<string, { name: string; description: string; nameEs: string; descriptionEs: string }> = {
  "recuerdos-y-recuerdos": {
    name: "Keepsakes & Memories",
    description: "Baby journals, photo albums, footprint frames and special keepsakes.",
    nameEs: "Recuerdos y Recuerdos",
    descriptionEs: "Diarios de bebés, álbumes de fotos, marcos de huellas y piezas especiales.",
  },
  "baby-essentials": {
    name: "Baby Essentials",
    description: "Baby accessories, pillows and everyday essentials.",
    nameEs: "Esenciales para Bebé",
    descriptionEs: "Accesorios para bebés, almohadas y elementos esenciales para el día a día.",
  },
};

export const CATEGORY_COPY: Record<string, { name: string; description: string; nameEs: string; descriptionEs: string }> = {
  "baby-journals": { name: "Baby Journals", description: "Memory books and journals.", nameEs: "Diarios de Bebé", descriptionEs: "Libros de recuerdos y diarios." },
  "photo-albums-frames": {
    name: "Photo Albums & Frames",
    description: "Albums, footprint frames and keepsake displays.",
    nameEs: "Álbumes y Marcos",
    descriptionEs: "Álbumes, marcos de huellas y recuerdos para exhibir.",
  },
  "blankets-pillows": { name: "Blankets & Pillows", description: "Soft essentials for the nursery.", nameEs: "Mantas y Almohadas", descriptionEs: "Esenciales suaves para el cuarto del bebé." },
  "plush-toys": { name: "Plush Toys", description: "Cuddly companions.", nameEs: "Peluches", descriptionEs: "Compañeros suaves para abrazar." },
  "accessory-sets": { name: "Accessory Sets", description: "Gift-ready accessory sets.", nameEs: "Sets de Accesorios", descriptionEs: "Sets de accesorios listos para regalar." },
};

/** Testimonials matched by customer name. */
export const TESTIMONIAL_COPY: Record<string, { review: string; reviewEs: string }> = {
  "Ana M.": {
    review: "Beautiful, high-quality products. The baby journal is simply perfect.",
    reviewEs: "Productos hermosos y de excelente calidad. El diario del bebé es simplemente perfecto.",
  },
  "Carlos R.": {
    review: "Ideal as a gift for new parents. Every little detail is taken care of.",
    reviewEs: "Ideal para regalar a nuevos padres. Todo está cuidado hasta el mínimo detalle.",
  },
  "Laura G.": {
    review: "We love their collections. Practical, beautiful and full of meaning.",
    reviewEs: "Nos encantan sus colecciones. Prácticas, bonitas y con mucho significado.",
  },
  "Miguel T.": {
    review: "I bought the album for my granddaughter and the whole family loved it.",
    reviewEs: "Compré el álbum para mi nieta y toda la familia quedó encantada.",
  },
};

/** FAQs matched by their current question (English or Spanish). */
export const FAQ_COPY: { match: string[]; question: string; answer: string; category: string; questionEs: string; answerEs: string; categoryEs: string }[] = [
  {
    match: ["How do I place an order?"],
    question: "How do I place an order?",
    answer: "Add products to your cart and submit the checkout form. Our team will contact you to confirm availability, shipping and payment.",
    category: "Orders",
    questionEs: "¿Cómo hago un pedido?",
    answerEs: "Agrega productos a tu carrito y envía el formulario de pedido. Nuestro equipo te contactará para confirmar disponibilidad, envío y pago.",
    categoryEs: "Pedidos",
  },
  {
    match: ["Can I send a product as a gift?"],
    question: "Can I send a product as a gift?",
    answer: "Yes. Add a gift message in the order notes and we will include it.",
    category: "Orders",
    questionEs: "¿Puedo enviar un producto como regalo?",
    answerEs: "Sí. Agrega un mensaje de regalo en las notas del pedido y lo incluiremos.",
    categoryEs: "Pedidos",
  },
  {
    match: ["How long does shipping take?"],
    question: "How long does shipping take?",
    answer: "Delivery times depend on your location. We confirm the estimated delivery date with you before payment.",
    category: "Shipping",
    questionEs: "¿Cuánto tarda el envío?",
    answerEs: "Los tiempos de entrega dependen de tu ubicación. Confirmamos contigo la fecha estimada de entrega antes del pago.",
    categoryEs: "Envíos",
  },
  {
    match: ["¿Los productos son seguros para bebés?", "Are the products safe for babies?"],
    question: "Are the products safe for babies?",
    answer: "Yes. We select products made with soft, safe materials for the little ones.",
    category: "Products",
    questionEs: "¿Los productos son seguros para bebés?",
    answerEs: "Sí. Seleccionamos productos con materiales suaves y seguros para los más pequeños.",
    categoryEs: "Productos",
  },
];

export const TEAM_COPY: Record<string, { name: string; role: string; bio: string; roleEs: string; bioEs: string }> = {
  Fundadora: {
    name: "Founder",
    role: "Founder & Curator",
    bio: "Selects every product with families in mind, and the memories that last.",
    roleEs: "Fundadora y curadora",
    bioEs: "Selecciona cada producto pensando en las familias y en los recuerdos que perduran.",
  },
};

export const OFFER_COPY: Record<string, { title: string; description: string; discountLabel: string; ctaLabel: string; titleEs: string; descriptionEs: string; discountLabelEs: string; ctaLabelEs: string }> = {
  "Keepsakes on sale": {
    title: "Keepsakes on sale",
    description: "Up to 20% off journals, albums and frames.",
    discountLabel: "Up to -20%",
    ctaLabel: "View Offers",
    titleEs: "Recuerdos en oferta",
    descriptionEs: "Hasta 20% de descuento en diarios, álbumes y marcos.",
    discountLabelEs: "Hasta -20%",
    ctaLabelEs: "Ver ofertas",
  },
};
