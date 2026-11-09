import Link from "next/link";
import { BearMark } from "@/components/common/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-[80vh] place-items-center bg-gradient-to-br from-baby via-warm to-blush-soft px-4 text-center">
      <div>
        <BearMark className="mx-auto h-24 w-28" />
        <p className="mt-6 font-serif text-7xl text-navy">404</p>
        <h1 className="mt-2 font-serif text-3xl">This page wandered off</h1>
        <p className="mt-2 text-ink/75">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-navy">
            Back to Home
          </Link>
          <Link href="/shop" className="btn-pink">
            Visit the Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
