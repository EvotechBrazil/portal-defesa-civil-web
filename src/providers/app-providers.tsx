"use client";

import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { I18nProvider } from "@/i18n/i18n-provider";
import { ToastProvider } from "@/components/ui/toast";
import type { Locale } from "@/i18n/translations";

export function AppProviders({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <ThemeProvider>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
