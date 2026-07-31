"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="สลับโหมดสว่าง/มืด"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Moon /> : <Sun />}
    </Button>
  );
}
