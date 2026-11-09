import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { FacebookIcon, InstagramIcon } from "@/components/common/Icons";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import type { SiteSettingsData } from "@/lib/content-defaults";

const COL_A = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/team", label: "Our Team" },
];
const COL_B = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];
const COL_C = [
  { href: "/shop", label: "Shop" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/booking", label: "Booking" },
];

export function Footer({ s, newsletter }: { s: SiteSettingsData; newsletter: { heading: string; text: string; buttonLabel: string } }) {
  return (
    <footer className="bg-navy text-white">
      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.1fr_1.6fr_1fr_1.2fr] lg:gap-8">
        <div>
          <Logo logoUrl={s.logo} name={s.businessName} company={s.companyName} inverted />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/75">{s.footerText}</p>
        </div>

        <nav aria-label="Enlaces rápidos" className="lg:border-r lg:border-white/15 lg:pr-8">
          <h2 className="font-sans text-base font-semibold text-white">Quick Links</h2>
          <div className="mt-4 grid grid-cols-3 gap-x-6 gap-y-2.5 text-sm text-white/85">
            {[COL_A, COL_B, COL_C].map((col, i) => (
              <ul key={i} className="space-y-2.5">
                {col.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-blush">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </nav>

        <div className="lg:border-r lg:border-white/15 lg:pr-8">
          <h2 className="font-sans text-base font-semibold text-white">Contact Us</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li>
              <a href={`mailto:${s.footerEmail}`} className="flex items-center gap-2.5 break-all hover:text-blush">
                <Mail aria-hidden className="h-4 w-4 shrink-0" /> {s.footerEmail}
              </a>
            </li>
            <li>
              <a href={`tel:${s.phone}`} className="flex items-center gap-2.5 hover:text-blush">
                <Phone aria-hidden className="h-4 w-4 shrink-0" /> {s.phone}
              </a>
            </li>
            {s.address && <li className="whitespace-pre-line">{s.address}</li>}
          </ul>
          <div className="mt-4 flex gap-3">
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {s.facebook && (
              <a href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-sans text-base font-semibold text-white">{newsletter.heading}</h2>
          <p className="mt-3 text-sm text-white/85">{newsletter.text || s.newsletterText}</p>
          <NewsletterForm buttonLabel={newsletter.buttonLabel} />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/65 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {s.companyName} ({s.businessName}). All rights reserved.
          </p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms & Conditions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
