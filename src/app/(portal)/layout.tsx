import { PortalHeader } from "@/components/layout/portal-header";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <PortalHeader />
      <main>{children}</main>
    </div>
  );
}
