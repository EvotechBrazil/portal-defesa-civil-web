"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_LOCALE,
  interpolate,
  LOCALE_STORAGE_KEY,
  TRANSLATIONS,
  type Locale,
  type TranslationVariables,
} from "./translations";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: TranslationVariables) => string;
  translateContent: (value: string) => string;
  contentReady: boolean;
  formatDate: (value: string | Date, options?: Intl.DateTimeFormatOptions) => string;
}

type ContentPack = Record<string, string>;
const AUTH_PATHS = ["/login", "/registro", "/verificar-email"];

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [contentPacks, setContentPacks] = useState<Partial<Record<Locale, ContentPack>>>({
    [DEFAULT_LOCALE]: {},
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));
    if (locale === DEFAULT_LOCALE || contentPacks[locale] || isAuthPage) return;

    const controller = new AbortController();
    void fetch(`/locales/${locale}/content.json`, {
      cache: "force-cache",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load content translations (${response.status})`);
        return response.json() as Promise<ContentPack>;
      })
      .then((pack) => {
        setContentPacks((current) => ({ ...current, [locale]: pack }));
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error(error);
        }
      });

    return () => controller.abort();
  }, [contentPacks, locale, pathname]);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    document.cookie = `${LOCALE_STORAGE_KEY}=${encodeURIComponent(next)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setLocaleState(next);
  }, []);
  const t = useCallback(
    (key: string, variables?: TranslationVariables) =>
      interpolate(TRANSLATIONS[locale][key] ?? TRANSLATIONS[DEFAULT_LOCALE][key] ?? key, variables),
    [locale],
  );
  const translateContent = useCallback(
    (value: string) =>
      locale === DEFAULT_LOCALE ? value : (contentPacks[locale]?.[value] ?? value),
    [contentPacks, locale],
  );
  const formatDate = useCallback(
    (value: string | Date, options?: Intl.DateTimeFormatOptions) => {
      const date = value instanceof Date ? value : new Date(value);
      return Number.isNaN(date.getTime())
        ? String(value)
        : new Intl.DateTimeFormat(locale, options).format(date);
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      translateContent,
      contentReady: locale === DEFAULT_LOCALE || Boolean(contentPacks[locale]),
      formatDate,
    }),
    [contentPacks, formatDate, locale, setLocale, t, translateContent],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
