/**
 * Espelho da validação do servidor. Existe para a pessoa ver o erro enquanto
 * digita, não para autorizar nada — quem decide continua sendo a API.
 */
const BR_DDD = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function canonicalWhatsapp(digits: string): string {
  const afterDdd = digits[4];
  if (
    digits.startsWith("55") &&
    digits.length === 12 &&
    afterDdd !== undefined &&
    "6789".includes(afterDdd)
  ) {
    return `${digits.slice(0, 4)}9${digits.slice(4)}`;
  }
  return digits;
}

export function isPlausibleWhatsapp(raw: string): boolean {
  if (!/^\d{8,15}$/.test(raw)) {
    return false;
  }
  const digits = canonicalWhatsapp(raw);
  if (/^(\d)\1+$/.test(digits)) {
    return false;
  }
  if (!digits.startsWith("55")) {
    return true;
  }
  if (!BR_DDD.has(Number(digits.slice(2, 4)))) {
    return false;
  }
  const rest = digits.slice(4);
  const celular = rest.length === 9 && rest.startsWith("9");
  const fixo = rest.length === 8 && "2345".includes(rest[0] ?? "");
  return celular || fixo;
}
