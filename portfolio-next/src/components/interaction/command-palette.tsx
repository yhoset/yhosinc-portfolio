"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useCommandPalette } from "@/components/interaction/command-palette-context";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const navItems = [
  { key: "home", href: "/" },
  { key: "projects", href: "/proyectos" },
  { key: "skills", href: "/skills" },
  { key: "roadmap", href: "/roadmap" },
  { key: "tools", href: "/tools" },
  { key: "about", href: "/sobre-mi" },
  { key: "contact", href: "/contacto" },
] as const;

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const t = useTranslations("Nav");
  const tPalette = useTranslations("CommandPalette");
  const locale = useLocale();
  const router = useRouter();

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const switchLocale = (nextLocale: (typeof routing.locales)[number]) => {
    setOpen(false);
    router.push("/", { locale: nextLocale });
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={tPalette("title")}
      description={tPalette("placeholder")}
    >
      <Command>
        <CommandInput placeholder={tPalette("placeholder")} />
        <CommandList>
          <CommandEmpty>{tPalette("empty")}</CommandEmpty>
          <CommandGroup heading={tPalette("navigation")}>
            {navItems.map((item) => (
              <CommandItem key={item.key} onSelect={() => go(item.href)}>
                {t(item.key)}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={tPalette("language")}>
            {routing.locales.map((loc) => (
              <CommandItem
                key={loc}
                disabled={loc === locale}
                onSelect={() => switchLocale(loc)}
              >
                {loc === "es" ? "Español" : "English"}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
