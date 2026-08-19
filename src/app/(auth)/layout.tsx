import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-paper">
          Portal Defesa Civil
        </p>
        {children}
      </div>
    </div>
  );
}
