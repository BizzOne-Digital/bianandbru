import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, makeT, type Lang } from "@/lib/i18n";

/** Current site language from the visitor's cookie (English by default). */
export const getLang = cache(async (): Promise<Lang> => {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(v) ? v : DEFAULT_LANG;
});

export async function getT() {
  return makeT(await getLang());
}
