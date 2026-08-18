export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-navy">
          Portal Defesa Civil
        </p>
        {children}
      </div>
    </div>
  );
}
