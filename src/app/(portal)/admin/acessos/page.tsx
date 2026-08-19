"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminAccessPage } from "@/features/access/components/admin-access-page";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useI18n } from "@/i18n/i18n-provider";

export default function Page() {
  const user = useAuthUser();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/estudar");
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") {
    return <p className="px-4 py-8 text-sm text-mist">{t("common.loading")}</p>;
  }

  return <AdminAccessPage />;
}
