import { LoginForm } from "@/features/auth/components/login-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cadastro?: string }>;
}) {
  const params = await searchParams;
  return <LoginForm registered={params.cadastro === "ok"} />;
}
