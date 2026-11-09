import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/shop/CartProvider";
import { IntroSplash } from "@/components/common/IntroSplash";
import { getSection, getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, newsletter] = await Promise.all([
    getSettings(),
    getSection<{ heading: string; text: string; buttonLabel: string }>("home.newsletter"),
  ]);
  return (
    <CartProvider>
      <IntroSplash name={s.businessName} company={s.companyName} />
      <a href="#main" className="sr-only z-[60] rounded-full bg-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <TopBar s={s} />
      <Header logo={s.logo} name={s.businessName} company={s.companyName} />
      <main id="main">{children}</main>
      <Footer s={s} newsletter={newsletter.data} />
    </CartProvider>
  );
}
