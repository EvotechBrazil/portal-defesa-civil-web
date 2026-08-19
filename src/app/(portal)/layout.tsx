import { PortalHeader } from "@/components/layout/portal-header";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PortalHeader />
      <main>{children}</main>
    </div>
  );
}
