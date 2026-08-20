import { Suspense } from "react";
import { TranslatedText } from "@/components/shared/translated-text";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-mist">
          <TranslatedText translationKey="common.loading" />
        </p>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
