import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-slate-600">Carregando...</p>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
