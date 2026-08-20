import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { TranslatedText } from "@/components/shared/translated-text";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-mist"><TranslatedText translationKey="common.loading" /></p>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
