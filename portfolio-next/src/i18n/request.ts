import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import es from "../../messages/es.json";
import en from "../../messages/en.json";

// Static imports (not `import(`./${locale}.json`)`) — Cloudflare Workers has
// no filesystem, and a dynamic path there fails at runtime under OpenNext.
const messagesByLocale = { es, en } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
