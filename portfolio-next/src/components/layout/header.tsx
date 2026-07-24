"use client";

import { useState } from "react";
import NextLink from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Coffee, Menu, Search, User, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useCommandPalette } from "@/components/interaction/command-palette-context";
import { HeaderLogo } from "@/components/interaction/header-logo";

const navItems = [
  { key: "projects", href: "/proyectos" },
  { key: "skills", href: "/skills" },
  { key: "roadmap", href: "/roadmap" },
  { key: "tools", href: "/tools" },
  { key: "about", href: "/sobre-mi" },
  { key: "contact", href: "/contacto" },
] as const;

export function Header() {
  const t = useTranslations("Nav");
  const tPalette = useTranslations("CommandPalette");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpen: setPaletteOpen } = useCommandPalette();

  const localeSwitcher = (
    <div className="flex items-center gap-1 font-label text-xs tracking-widest">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          aria-current={locale === loc ? "true" : undefined}
          className={
            locale === loc
              ? "rounded-sm bg-cyan px-2 py-1 text-ink"
              : "rounded-sm px-2 py-1 text-white/60 hover:text-cyan"
          }
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/60 bg-ink/80 backdrop-blur-sm"
      style={{ viewTransitionName: "site-header" } as React.CSSProperties}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <motion.span
            whileHover={{ scale: 1.08, rotate: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            className="flex"
          >
            <HeaderLogo />
          </motion.span>
          <span className="font-display text-2xl tracking-wide text-cyan">YHOSINC</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group relative py-1 font-label text-sm tracking-wider text-white/70 transition-colors hover:text-cyan"
            >
              {t(item.key)}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-cyan transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label={tPalette("title")}
          className="hidden items-center gap-2 rounded-sm border border-white/15 px-2.5 py-1.5 text-xs text-white/60 transition-colors hover:border-cyan/50 hover:text-cyan md:flex"
        >
          <Search size={14} />
          <span className="font-label tracking-widest">⌘K</span>
        </button>

        <div className="hidden md:block">{localeSwitcher}</div>

        {/* Cuenta de visitante — a diferencia de Coffee+, esta SÍ es una
            entrada de navegación normal y visible (registrarse/entrar es
            algo que un visitante debe poder encontrar). Va a /cuenta,
            dentro de [locale], por eso usa el Link de next-intl. */}
        <Link
          href="/cuenta"
          className="hidden items-center gap-1.5 rounded-sm border border-white/15 px-2.5 py-1.5 text-xs text-white/60 transition-colors hover:border-cyan/50 hover:text-cyan md:flex"
        >
          <User size={14} />
          <span className="font-label tracking-widest">{t("account")}</span>
        </Link>

        {/* Entrada al panel de admin — visible para cualquiera (es la
            gracia, un huevo de pascua con onda "power up"), pero /admin
            pide login real: un visitante nunca pasa de la pantalla de
            acceso. Es <a> plano, no el Link de next-intl, porque /admin
            vive fuera de [locale] (sin prefijo de idioma). */}
        <NextLink
          href="/admin"
          className="hidden items-center gap-1.5 rounded-sm border border-white/15 px-2.5 py-1.5 text-xs text-white/60 transition-colors hover:border-yellow/50 hover:text-yellow md:flex"
        >
          <Coffee size={14} />
          <span className="font-label tracking-widest">{t("adminAccess")}</span>
        </NextLink>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label={tPalette("title")}
          className="text-white/80 hover:text-cyan md:hidden"
        >
          <Search size={20} />
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="text-white/80 hover:text-cyan md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-1 overflow-hidden border-t border-border/60 bg-ink px-4 md:hidden"
          >
            <div className="flex flex-col gap-1 py-4">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2, ease: "easeOut" }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-label block py-2 text-sm tracking-wider text-white/70 transition-colors hover:text-cyan"
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/cuenta"
                onClick={() => setMenuOpen(false)}
                className="font-label flex items-center gap-1.5 py-2 text-sm tracking-wider text-white/70 transition-colors hover:text-cyan"
              >
                <User size={14} /> {t("account")}
              </Link>
              <NextLink
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="font-label flex items-center gap-1.5 py-2 text-sm tracking-wider text-white/50 transition-colors hover:text-yellow"
              >
                <Coffee size={14} /> {t("adminAccess")}
              </NextLink>
              <div className="pt-2">{localeSwitcher}</div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
