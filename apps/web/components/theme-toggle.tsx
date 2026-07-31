"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@peckey954/ui/components/ui/button";

import { defineCopy, useCopy } from "@/lib/i18n";

const COPY = defineCopy({
  th: { toggle: "สลับโหมดสว่าง/มืด" },
  en: { toggle: "Toggle light / dark mode" },
});

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const c = useCopy(COPY);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={c.toggle}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Moon /> : <Sun />}
    </Button>
  );
}
