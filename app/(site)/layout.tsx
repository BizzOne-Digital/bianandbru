import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/shop/CartProvider";
import { IntroSplash } from "@/components/common/IntroSplash";
import { LangProvider } from "@/components/common/LangProvider";
import { getSection, getSettings } from "@/lib/data";
import { getLang } from "@/lib/lang";
import { makeT } from "@/lib/i18n";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [lang, s, newsletter] = await Promise.all([
    getLang(),
    getSettings(),
    getSection<{ heading: string; text: string; buttonLabel: string }>("home.newsletter"),
  ]);
  const t = makeT(lang);
  return (
    <LangProvider lang={lang}>
    <CartProvider>
      <IntroSplash name={s.businessName} company={s.companyName} />
      <a href="#main" className="sr-only z-[60] rounded-full bg-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t("nav.skip")}
      </a>
      <TopBar s={s} />
      <Header logo={s.logo} name={s.businessName} company={s.companyName} />
      <main id="main">{children}</main>
      <Footer s={s} newsletter={newsletter.data} lang={lang} />
    </CartProvider>
    </LangProvider>
  );
}
