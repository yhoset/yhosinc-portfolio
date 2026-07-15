"use client";

import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useCommandPalette } from "@/components/interaction/command-palette-context";

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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-ink/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-cyan transition-opacity hover:opacity-80"
          onClick={() => setMenuOpen(false)}
        >
          YHOSINC
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="font-label text-sm tracking-wider text-white/70 transition-colors hover:text-cyan"
            >
              {t(item.key)}
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

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="flex flex-col gap-1 border-t border-border/60 bg-ink px-4 py-4 md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-label py-2 text-sm tracking-wider text-white/70 transition-colors hover:text-cyan"
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="pt-2">{localeSwitcher}</div>
        </nav>
      )}
    </header>
  );
}
