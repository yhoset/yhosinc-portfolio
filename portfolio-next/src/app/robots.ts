import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin ya lleva `robots: { index: false, follow: false }` en su
      // propio layout (src/app/admin/layout.tsx) — esto es un segundo
      // cinturón, no la única protección.
      disallow: "/admin",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
