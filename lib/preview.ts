import "server-only";
import { getAdminSession } from "@/lib/auth";

/** Admins can append ?preview=1 to see unpublished sections. */
export async function isPreview(sp: Record<string, string | string[] | undefined>) {
  if (sp.preview !== "1") return false;
  return !!(await getAdminSession());
}
