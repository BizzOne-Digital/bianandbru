import { getT } from "@/lib/lang";
import Link from "next/link";
import { BearMark } from "@/components/common/Logo";

export default async function NotFound() {
  const t = await getT();
  return (
    <main className="grid min-h-[80vh] place-items-center bg-gradient-to-br from-baby via-warm to-blush-soft px-4 text-center">
      <div>
        <BearMark className="mx-auto h-24 w-28" />
        <p className="mt-6 font-serif text-7xl text-navy">404</p>
        <h1 className="mt-2 font-serif text-3xl">{t("notFound.title")}</h1>
        <p className="mt-2 text-ink/75">{t("notFound.text")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-navy">
            {t("notFound.home")}
          </Link>
          <Link href="/shop" className="btn-pink">
            {t("notFound.shop")}
          </Link>
        </div>
      </div>
    </main>
  );
}
