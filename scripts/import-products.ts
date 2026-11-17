/**
 * Imports the client's product catalog (English + Spanish).
 *   npx tsx scripts/import-products.ts
 * Safe to re-run: products are upserted by slug.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Collection } from "../models/Collection";

const img = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `/images/products/${slug}-${i + 1}.webp`);

const CATEGORIES = [
  { slug: "wall-art", name: "Nursery Wall Art", nameEs: "Cuadros para Bebé", displayOrder: 6 },
  { slug: "toys", name: "Toys", nameEs: "Juguetes", displayOrder: 7 },
  { slug: "bath-care", name: "Bath & Care", nameEs: "Baño y Cuidado", displayOrder: 8 },
  { slug: "storage-home", name: "Storage & Home", nameEs: "Organización y Hogar", displayOrder: 9 },
  { slug: "loungers-comfort", name: "Loungers & Comfort", nameEs: "Cojines y Confort", displayOrder: 10 },
];

type P = {
  slug: string; images: number; category: string; collection: string;
  name: string; nameEs: string; short: string; shortEs: string; desc: string; descEs: string;
  price: number; compareAt?: number; featured?: boolean; published?: boolean; keywords: string[];
};

const PRODUCTS: P[] = [
  {
    slug: "safari-watercolor-prints", images: 5, category: "wall-art", collection: "baby-essentials",
    name: "Safari Animals Watercolor Prints – Set of 3", nameEs: "Láminas Acuarela Animales Safari – Set de 3",
    short: "Unframed watercolor canvas prints with elephants, giraffes and lions.",
    shortEs: "Láminas de lienzo en acuarela sin marco con elefantes, jirafas y leones.",
    desc: "Set of 3 flat 2D watercolor canvas prints without frames, featuring adorable safari animals such as elephants, giraffes and lions. Perfect for boho jungle-themed baby room decor.\n\nIdeal for children's rooms, playrooms, classrooms, Christmas decor, birthdays and more.\n\nNote: frames not included.",
    descEs: "Set de 3 láminas de lienzo en acuarela 2D sin marco, con adorables animales safari como elefantes, jirafas y leones. Perfectas para decorar el cuarto del bebé con estilo jungla boho.\n\nIdeales para cuartos infantiles, salas de juego, aulas, decoración navideña, cumpleaños y más.\n\nNota: no incluye marcos.",
    price: 23, compareAt: 32, featured: true, keywords: ["wall art", "prints", "safari", "nursery decor", "cuadros"],
  },
  {
    slug: "teddy-truck-print", images: 4, category: "wall-art", collection: "baby-essentials",
    name: "Vintage Teddy Bear & Truck Nursery Print", nameEs: "Lámina Vintage Osito y Camión",
    short: "Unframed HD canvas print with a teddy bear, classic truck and leaf wreath.",
    shortEs: "Lámina de lienzo HD sin marco con osito, camión clásico y corona de hojas.",
    desc: "Flat 2D poster featuring vintage cartoon artwork, including a teddy bear, a classic truck and a botanical leaf wreath on a striped background.\n\nUnframed HD canvas wall art, perfect for bedrooms, living rooms, nurseries and children's rooms. An ideal gift for baby showers and housewarmings.\n\nNote: frame not included.",
    descEs: "Lámina 2D con ilustración vintage de un osito, un camión clásico y una corona de hojas sobre fondo de rayas.\n\nArte de pared en lienzo HD sin marco, perfecto para dormitorios, salas, cuartos de bebé e infantiles. Un regalo ideal para baby showers.\n\nNota: no incluye marco.",
    price: 19, compareAt: 27, keywords: ["wall art", "teddy bear", "print", "osito"],
  },
  {
    slug: "kawaii-sleeping-bear-prints", images: 3, category: "wall-art", collection: "baby-essentials",
    name: "Kawaii Sleeping Bear Prints – Set of 3", nameEs: "Láminas Osito Dormilón – Set de 3",
    short: "Gender-neutral nursery prints with clouds, stars and balloons.",
    shortEs: "Láminas neutras con nubes, estrellas y globos.",
    desc: "Flat 2D prints featuring a kawaii sleeping bear in soft brown tones, perfect for nursery and toddler room decor.\n\nThis gender-neutral baby animal poster set includes unframed vertical prints with charming cloud, star and hot air balloon elements. Ideal for bedrooms, nurseries and baby room decorations.\n\nNote: frames not included.",
    descEs: "Láminas 2D con un tierno osito dormilón en suaves tonos marrones, perfectas para el cuarto del bebé.\n\nSet neutro de láminas verticales sin marco con nubes, estrellas y globos. Ideal para dormitorios y cuartos de bebé.\n\nNota: no incluye marcos.",
    price: 21, compareAt: 32, keywords: ["wall art", "bear", "prints", "nursery"],
  },
  {
    slug: "handprint-footprint-keepsake-kit", images: 8, category: "photo-albums-frames", collection: "recuerdos-y-recuerdos",
    name: "Baby Handprint & Footprint Keepsake Kit – Clay Photo Frame", nameEs: "Kit Recuerdo de Huellas de Manos y Pies – Marco con Arcilla",
    short: "Capture tiny hands and feet in quick-drying clay.",
    shortEs: "Guarda las manitas y piecitos en arcilla de secado rápido.",
    desc: "Create lasting memories with this adorable Baby Handprint and Footprint Keepsake Kit. Perfect for capturing your newborn's tiny hands and feet, this personalized photo frame kit can also be used to preserve your pet's paw prints.\n\nThe kit includes quick-drying clay, gold acrylic paint, a paintbrush and a name/date imprinting kit, so you can customize your keepsake.\n\nMade with 100% baby-safe, food-grade clay. An ideal gift for baby showers, gender reveal parties, newborn celebrations, Mother's Day and new parents.",
    descEs: "Crea recuerdos para siempre con este tierno kit de huellas de manos y pies. Perfecto para guardar las manitas y piecitos de tu recién nacido; también sirve para las huellas de tu mascota.\n\nIncluye arcilla de secado rápido, pintura acrílica dorada, pincel y kit para grabar nombre y fecha.\n\nArcilla 100% segura para bebés y de grado alimenticio. Un regalo ideal para baby showers, revelaciones de género, Día de la Madre y nuevos padres.",
    price: 29.9, compareAt: 34, featured: true, keywords: ["footprint", "handprint", "keepsake", "frame", "huellas"],
  },
  {
    slug: "duck-toothbrush-covers", images: 7, category: "bath-care", collection: "baby-essentials",
    name: "Cute Yellow Duck Toothbrush Covers – 4 Pieces", nameEs: "Protectores de Cepillo Patito Amarillo – 4 Piezas",
    short: "Portable protective cases that keep toothbrushes clean.",
    shortEs: "Estuches protectores portátiles para cepillos de dientes.",
    desc: "Keep your toothbrushes clean and protected with this adorable 4-piece set of yellow duck toothbrush head covers. Featuring a cute, soft-looking duck design, these covers are both practical and hygienic.\n\nDesigned to protect toothbrush heads from dust and dirt, they are perfect for everyday bathroom use, travel and home storage. A cute and practical bathroom accessory for the whole family.",
    descEs: "Mantén tus cepillos limpios y protegidos con este tierno set de 4 protectores de patito amarillo. Prácticos e higiénicos.\n\nProtegen el cabezal del polvo y la suciedad; perfectos para el baño, los viajes y el hogar. Un accesorio lindo y práctico para toda la familia.",
    price: 13.9, compareAt: 17, keywords: ["toothbrush", "duck", "bath", "cepillo"],
  },
  {
    slug: "hand-accordion-toy", images: 10, category: "toys", collection: "baby-essentials",
    name: "Fun Cartoon Hand Accordion Toy – Assorted Colors", nameEs: "Acordeón de Mano Infantil – Colores Surtidos",
    short: "Colorful accordion toy that builds motor skills. Random color shipped.",
    shortEs: "Acordeón colorido que ayuda a la motricidad. Color aleatorio.",
    desc: "Make playtime fun with this adorable cartoon-style hand accordion toy! Available in candy green, candy pink and light blue, this colorful toy entertains children while helping develop important motor skills.\n\nMade from durable, lightweight ABS plastic, it helps improve hand-eye coordination, grip strength and fine motor skills through interactive play. A wonderful gift for birthdays and holidays.\n\nColors: Candy Green, Candy Pink, Light Blue (random color shipped).\nMaterial: ABS plastic.",
    descEs: "¡Haz el juego más divertido con este tierno acordeón de mano estilo caricatura! Disponible en verde, rosa y azul claro.\n\nHecho de plástico ABS resistente y liviano, ayuda a mejorar la coordinación, la fuerza de agarre y la motricidad fina. Un regalo ideal para cumpleaños y fiestas.\n\nColores: verde, rosa, azul claro (se envía color aleatorio).\nMaterial: plástico ABS.",
    price: 13, compareAt: 17, keywords: ["accordion", "toy", "musical", "acordeón"],
  },
  {
    slug: "keepsake-box-set", images: 4, category: "baby-journals", collection: "recuerdos-y-recuerdos",
    name: "Baby Keepsake Box Set – 4 Pieces", nameEs: "Set de Cajitas de Recuerdos para Bebé – 4 Piezas",
    short: "Store first haircut, umbilical cord, baby teeth and hospital tag.",
    shortEs: "Guarda el primer corte de pelo, cordón umbilical, dientes y pulsera del hospital.",
    desc: "Preserve your baby's most precious memories with this beautiful 4-piece keepsake box set, designed to safely store special milestones from your little one's early days.\n\nEach set includes four boxes for:\n• First lock of hair\n• Umbilical cord stump\n• Baby teeth\n• Hospital tag\n\nPerfect for baby showers, newborn celebrations and thoughtful gifts for new moms and dads.",
    descEs: "Guarda los recuerdos más preciosos de tu bebé con este hermoso set de 4 cajitas, diseñado para conservar los primeros hitos.\n\nIncluye cuatro cajitas para:\n• Primer mechón de cabello\n• Cordón umbilical\n• Dientes de leche\n• Pulsera del hospital\n\nPerfecto para baby showers y como regalo para nuevos papás.",
    price: 16.3, compareAt: 19.9, featured: true, keywords: ["keepsake", "box", "first haircut", "tooth fairy", "recuerdos"],
  },
  {
    slug: "door-stopper-set", images: 4, category: "storage-home", collection: "baby-essentials",
    name: "Human-Shaped Door Stopper Set – 2 Pieces", nameEs: "Topes de Puerta en Forma de Persona – 2 Piezas",
    short: "Decorative, weighted door holders that prevent slamming.",
    shortEs: "Topes decorativos y pesados que evitan golpes de puerta.",
    desc: "Add a fun and practical touch to your home with this 2-piece human-shaped door stopper set. They hold doors securely in place, help prevent sudden slamming and protect walls from impacts.\n\nFeatures:\n• Set of 2 decorative door stoppers (black + white)\n• Unique human-shaped design\n• Weighted design for stability\n• Helps prevent doors from slamming\n• Protects walls from door impacts\n\nPerfect for bedrooms, entryways, living rooms and offices.",
    descEs: "Dale un toque divertido y práctico a tu hogar con este set de 2 topes de puerta en forma de persona. Sujetan la puerta, evitan portazos y protegen las paredes.\n\nCaracterísticas:\n• Set de 2 topes decorativos (negro + blanco)\n• Diseño único en forma de persona\n• Peso estable\n• Evita portazos\n• Protege las paredes\n\nPerfectos para dormitorios, entradas, salas y oficinas.",
    price: 11.9, compareAt: 13.9, keywords: ["door stopper", "home", "tope de puerta"],
  },
  {
    slug: "baby-lounger-nursing-pillow", images: 7, category: "loungers-comfort", collection: "baby-essentials",
    name: "Multifunctional Baby Lounger & Nursing Pillow", nameEs: "Cojín Multifuncional para Bebé y Lactancia",
    short: "Removable, washable support cushion for feeding and tummy time.",
    shortEs: "Cojín de apoyo desmontable y lavable para alimentar y jugar.",
    desc: "Make feeding and playtime more comfortable with this multifunctional baby lounger and nursing pillow. It provides gentle support for breastfeeding, bottle feeding and supervised tummy time.\n\nKey features:\n• Ergonomic contoured design with 10° incline\n• Adjustable U-shaped support (velcro on the back)\n• High-resilience sponge core, soft breathable fabric\n• Removable cushion for easy hand washing\n• A thoughtful baby shower gift\n\nSafety note: for awake, supervised use only. Not intended for infant sleep or use as a sleep surface.",
    descEs: "Haz más cómodos los momentos de alimentación y juego con este cojín multifuncional para bebé. Brinda apoyo suave para lactancia, biberón y tiempo boca abajo supervisado.\n\nCaracterísticas:\n• Diseño ergonómico con inclinación de 10°\n• Soporte en U ajustable (velcro trasero)\n• Núcleo de esponja de alta resiliencia y tela suave\n• Cojín desmontable, lavado suave a mano\n• Un regalo ideal para baby showers\n\nNota de seguridad: solo para uso con el bebé despierto y bajo supervisión. No apto para dormir.",
    price: 49, compareAt: 54, featured: true, keywords: ["lounger", "nursing pillow", "cushion", "cojín"],
  },
  {
    slug: "jungle-storage-basket", images: 6, category: "storage-home", collection: "baby-essentials",
    name: "Jungle Animal Watercolor Storage Basket", nameEs: "Canasta Organizadora Animales de la Selva",
    short: "Durable, foldable canvas organizer for toys, clothes and essentials.",
    shortEs: "Organizador plegable de lona para juguetes, ropa y esenciales.",
    desc: "Keep your space neat and organized with this adorable jungle animal watercolor storage basket. Its whimsical illustrations add a playful, decorative touch to any room.\n\nKey features:\n• Cute jungle animal watercolor design\n• Durable canvas with sturdy handles\n• Folds flat when not in use\n• Perfect for toys, clothes, books and baby essentials\n• Ideal for nurseries, kids' rooms, closets and the car",
    descEs: "Mantén todo ordenado con esta tierna canasta organizadora con animales de la selva en acuarela.\n\nCaracterísticas:\n• Diseño de animales en acuarela\n• Lona resistente con asas firmes\n• Se pliega cuando no se usa\n• Ideal para juguetes, ropa, libros y esenciales del bebé\n• Perfecta para cuartos infantiles, closets y el auto",
    price: 19.7, keywords: ["storage", "basket", "organizer", "canasta"],
  },
  {
    slug: "safari-plush-blanket", images: 2, category: "blankets-pillows", collection: "baby-essentials",
    name: "Safari Animal Plush Blanket – Elephant, Giraffe & Monkey", nameEs: "Manta de Felpa Animales Safari",
    short: "Soft, cozy plush blanket — 100 x 70 cm.",
    shortEs: "Manta de felpa suave y acogedora — 100 x 70 cm.",
    desc: "Keep your little one warm and cozy with this adorable safari animal plush blanket, featuring a charming 2D cartoon print of elephants, giraffes and monkeys.\n\nKey features:\n• Soft, warm plush material\n• Lightweight for everyday use, travel and naps\n• Size: 100 x 70 cm (37 x 27.5 in)\n• A thoughtful gift for baby showers and holidays\n\nSafety note: keep loose blankets out of infants' sleep spaces. Not recommended for unsupervised sleep for babies under 12 months.",
    descEs: "Mantén a tu pequeño abrigado con esta tierna manta de felpa con elefantes, jirafas y monos.\n\nCaracterísticas:\n• Felpa suave y cálida\n• Liviana para uso diario, viajes y siestas\n• Tamaño: 100 x 70 cm\n• Un regalo ideal para baby showers\n\nNota de seguridad: no dejes mantas sueltas en el espacio donde duerme el bebé. No recomendada para el sueño sin supervisión en menores de 12 meses.",
    price: 15.9, keywords: ["blanket", "safari", "plush", "manta"],
  },
  {
    slug: "rocking-support-cushion", images: 4, category: "loungers-comfort", collection: "baby-essentials",
    name: "Bear Plush Rocking Support Cushion with Remote", nameEs: "Cojín Osito con Movimiento y Control Remoto",
    short: "Bear nest with soothing patting hands, 3 speeds and remote control.",
    shortEs: "Nido de osito con manitas que dan palmaditas, 3 velocidades y control remoto.",
    desc: "Enjoy soothing comfort with this soft bear plush support cushion, designed to provide gentle, rhythmic movement.\n\nKey features:\n• 3 adjustable speeds\n• Remote control\n• Gentle rhythmic patting motion\n• Soft dotted plush material\n• Removable head support and toys included\n\nSafety note: use only while the baby is awake and under direct adult supervision. Not suitable for infant sleep.",
    descEs: "Disfruta de un confort relajante con este suave cojín de osito que ofrece un movimiento rítmico y delicado.\n\nCaracterísticas:\n• 3 velocidades ajustables\n• Control remoto\n• Palmaditas rítmicas suaves\n• Felpa suave con puntitos\n• Incluye soporte de cabeza y juguetes\n\nNota de seguridad: úsese solo con el bebé despierto y bajo supervisión directa de un adulto. No apto para dormir.",
    price: 129, compareAt: 159, featured: true, keywords: ["bear", "cushion", "rocking", "remote", "osito"],
  },
  {
    slug: "bear-baby-nest", images: 4, category: "loungers-comfort", collection: "baby-essentials",
    name: "Little Brown Bear Baby Nest – Double-Sided", nameEs: "Nido para Bebé Osito Café – Doble Cara",
    short: "Soft dotted plush baby nest with a cozy bear design and paw strap.",
    shortEs: "Nido de felpa suave con diseño de osito y banda de patita.",
    desc: "Give your little one a snug, cozy space with this adorable Little Brown Bear baby nest. Made of soft dotted plush, it features a cute embroidered bear face, plush ears and a gentle paw-print strap.\n\nKey features:\n• Soft dotted plush, gentle on baby's skin\n• Cute bear design with embroidered face\n• Double-sided use\n• Carry handles for easy moving around the home\n• A lovely baby shower gift\n\nSafety note: for awake, supervised use only. Not intended for unsupervised infant sleep. Always place babies to sleep on their back in a crib or bassinet.",
    descEs: "Brinda a tu pequeño un espacio suave y acogedor con este tierno nido de osito café. Hecho de felpa suave con puntitos, tiene carita de osito bordada, orejitas de peluche y una banda con huellita.\n\nCaracterísticas:\n• Felpa suave, delicada con la piel del bebé\n• Diseño de osito con carita bordada\n• Uso de doble cara\n• Asas para moverlo fácilmente por la casa\n• Un lindo regalo para baby showers\n\nNota de seguridad: solo para uso con el bebé despierto y bajo supervisión. No apto para el sueño sin supervisión. Acuesta siempre al bebé boca arriba en su cuna.",
    price: 49, compareAt: 54, featured: true, keywords: ["baby nest", "bear", "lounger", "nido", "osito"],
  },
  {
    slug: "giraffe-patting-pillow", images: 7, category: "plush-toys", collection: "baby-essentials",
    name: "Interactive Giraffe Plush Patting Pillow", nameEs: "Jirafa de Peluche con Palmaditas",
    short: "Automatic soothing toy with remote control, 3 speeds and calming sounds.",
    shortEs: "Peluche calmante con control remoto, 3 velocidades y sonidos relajantes.",
    desc: "Bring comfort and joy to your little one with this adorable interactive giraffe plush. Its gentle, rhythmic patting motion provides a comforting experience during supervised relaxation.\n\nKey features:\n• Soft, cuddly giraffe design (60 x 25 cm)\n• Automatic patting with 3 adjustable speeds\n• Remote control and soothing sounds\n• Rechargeable battery\n• Zipper cover, machine washable\n• Described by the manufacturer as CPC-certified\n\nSafety note: use only under direct adult supervision. Do not place in an infant's crib or sleep area, and do not use while a baby is sleeping.",
    descEs: "Brinda consuelo y alegría con esta tierna jirafa de peluche interactiva. Sus palmaditas suaves y rítmicas acompañan los momentos de relajación supervisada.\n\nCaracterísticas:\n• Diseño de jirafa suave (60 x 25 cm)\n• Palmaditas automáticas con 3 velocidades\n• Control remoto y sonidos relajantes\n• Batería recargable\n• Funda con cierre, lavable a máquina\n• Certificación CPC según el fabricante\n\nNota de seguridad: úsese solo bajo supervisión directa de un adulto. No colocar en la cuna ni usar mientras el bebé duerme.",
    price: 41, compareAt: 48, keywords: ["giraffe", "plush", "soothing", "jirafa", "peluche"],
  },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  for (const c of CATEGORIES)
    await Category.updateOne({ slug: c.slug }, { $setOnInsert: { description: "", descriptionEs: "", image: "", published: true }, $set: c }, { upsert: true });
  const cats = Object.fromEntries((await Category.find().lean()).map((c) => [c.slug, c._id]));
  const cols = Object.fromEntries((await Collection.find().lean()).map((c) => [c.slug, c._id]));

  for (const p of PRODUCTS) {
    const images = img(p.slug, p.images);
    const discount = p.compareAt && p.compareAt > p.price ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;
    await Product.updateOne(
      { slug: p.slug },
      {
        $set: {
          name: p.name, nameEs: p.nameEs, shortDescription: p.short, shortDescriptionEs: p.shortEs,
          description: p.desc, descriptionEs: p.descEs, price: p.price, compareAtPrice: discount ? p.compareAt : null,
          discountPercent: discount, images, thumbnail: images[0], keywords: p.keywords,
          category: cats[p.category] ?? null, collectionRef: cols[p.collection] ?? null,
          featured: !!p.featured, published: p.published !== false, status: p.published === false ? "draft" : "active",
        },
        $setOnInsert: { currency: "USD", sku: `BB-${p.slug.slice(0, 12).toUpperCase()}`, stock: 20, trackInventory: true },
      },
      { upsert: true }
    );
    console.log(`${p.published === false ? "DRAFT" : "OK   "} ${p.name}`);
  }
  await mongoose.disconnect();
}
main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
