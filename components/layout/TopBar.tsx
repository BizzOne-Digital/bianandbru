import { Building2, Mail, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/common/Icons";
import type { SiteSettingsData } from "@/lib/content-defaults";

export function TopBar({ s }: { s: SiteSettingsData }) {
  return (
    <div className="bg-navy text-white">
      <div className="container-x flex h-9 items-center justify-between gap-4 text-[13px] sm:h-10 sm:text-sm">
        <p className="flex min-w-0 items-center gap-2 truncate">
          <Building2 aria-hidden className="h-4 w-4 shrink-0" strokeWidth={1.6} />
          <span className="truncate">{s.announcement}</span>
        </p>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href={`mailto:${s.email}`} className="hidden items-center gap-2 hover:text-blush md:flex">
            <Mail aria-hidden className="h-4 w-4" strokeWidth={1.6} />
            {s.email}
          </a>
          <a href={`tel:${s.phone}`} className="flex items-center gap-2 hover:text-blush" aria-label={`Llamar ${s.phone}`}>
            <Phone aria-hidden className="h-4 w-4" strokeWidth={1.6} />
            <span className="hidden sm:inline">{s.phone}</span>
          </a>
          {s.instagram && (
            <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-blush">
              <InstagramIcon className="h-[18px] w-[18px]" />
            </a>
          )}
          {s.facebook && (
            <a href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blush">
              <FacebookIcon className="h-[18px] w-[18px]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
