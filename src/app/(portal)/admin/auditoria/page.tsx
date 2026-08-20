import { RequireRole } from "@/features/auth/components/require-role";
import { RoleChangeLog } from "@/features/users/components/role-change-log";

// Regua acima da do segmento /admin: a trilha e so de ADMIN_SENIOR para cima.
export default function Page() {
  return (
    <RequireRole min="ADMIN_SENIOR">
      <RoleChangeLog />
    </RequireRole>
  );
}
