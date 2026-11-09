import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/data";
import { SITE_URL, getSafeImageUrl } from "@/lib/utils";
import "./globals.css";

// All content is admin-managed in MongoDB, so render on request.
export const dynamic = "force-dynamic";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans", display: "swap" });

export const viewport: Viewport = { themeColor: "#0A3158" };

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const og = getSafeImageUrl(s.ogImage, "");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.seoTitle, template: `%s | ${s.businessName}` },
    description: s.seoDescription,
    applicationName: s.businessName,
    icons: s.favicon ? { icon: getSafeImageUrl(s.favicon, "/favicon.svg") } : { icon: "/favicon.svg" },
    openGraph: {
      type: "website",
      siteName: s.businessName,
      title: s.seoTitle,
      description: s.seoDescription,
      images: og ? [{ url: og }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
