"use client";

import { useI18n } from "@/i18n/i18n-provider";

export function TranslatedText({ translationKey }: { translationKey: string }) {
  const { t } = useI18n();
  return <>{t(translationKey)}</>;
}
