"use client";

import { Tabs, TabsList, TabsTrigger } from "@peckey954/ui/components/ui/tabs";

import { LANGS, useLang, type Lang } from "./providers";
import { useT } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const t = useT();

  return (
    <Tabs
      value={lang}
      onValueChange={(value) => setLang(value as Lang)}
      aria-label={t("lang.aria")}
    >
      <TabsList>
        {LANGS.map((l) => (
          <TabsTrigger key={l.id} value={l.id} title={l.label}>
            {l.short}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
