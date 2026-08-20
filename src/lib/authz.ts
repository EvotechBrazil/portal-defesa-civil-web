import type { Role } from "@/types/api.types";

/**
 * Espelho de portal-defesa-civil-api/src/common/authz/role-hierarchy.ts.
 *
 * Duplicacao consciente: nao ha package compartilhado entre os dois repos.
 * Este mapa decide APENAS o que aparece na tela — a autoridade e sempre a API,
 * que responde 403. Ao mexer na hierarquia, mexa nos dois arquivos.
 */
export const ROLE_LEVEL: Record<Role, number> = {
  STUDENT: 0,
  ADMIN: 10,
  ADMIN_SENIOR: 20,
  SUPER_ADMIN: 30,
};

/** SUPER_ADMIN fica de fora: nasce so pelo seed, nunca pela tela. */
export const ASSIGNABLE_ROLES: readonly Role[] = [
  "STUDENT",
  "ADMIN",
  "ADMIN_SENIOR",
];

export function roleLevel(role: Role): number {
  return ROLE_LEVEL[role];
}

export function hasAtLeast(role: Role, minRole: Role): boolean {
  return roleLevel(role) >= roleLevel(minRole);
}

/** O ator pode mexer no papel deste alvo? Estritamente acima. */
export function canManageRole(actorRole: Role, targetRole: Role): boolean {
  return roleLevel(actorRole) > roleLevel(targetRole);
}

/** O ator pode conceder este papel? Estritamente acima e atribuivel. */
export function canAssignRole(actorRole: Role, nextRole: Role): boolean {
  return (
    ASSIGNABLE_ROLES.includes(nextRole) &&
    roleLevel(actorRole) > roleLevel(nextRole)
  );
}
