export interface CountryOption {
  code: string;
  name: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "BR", name: "Brasil" },
  { code: "AR", name: "Argentina" },
  { code: "BO", name: "Bolívia" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colômbia" },
  { code: "EC", name: "Equador" },
  { code: "PY", name: "Paraguai" },
  { code: "PE", name: "Peru" },
  { code: "UY", name: "Uruguai" },
  { code: "VE", name: "Venezuela" },
  { code: "MX", name: "México" },
  { code: "US", name: "Estados Unidos" },
  { code: "PT", name: "Portugal" },
  { code: "ES", name: "Espanha" },
];

export interface IbgeState {
  sigla: string;
  nome: string;
}

export interface IbgeCity {
  nome: string;
}

const IBGE_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

export async function fetchBrazilStates(): Promise<IbgeState[]> {
  const response = await fetch(`${IBGE_BASE}/estados?orderBy=nome`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar os estados.");
  }
  const rows = (await response.json()) as Array<{ sigla: string; nome: string }>;
  return rows.map((row) => ({ sigla: row.sigla, nome: row.nome }));
}

export async function fetchBrazilCities(uf: string): Promise<string[]> {
  const response = await fetch(`${IBGE_BASE}/estados/${uf}/municipios?orderBy=nome`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar as cidades.");
  }
  const rows = (await response.json()) as IbgeCity[];
  return rows.map((row) => row.nome);
}

export function formatPackPlace(pack: {
  city: string;
  state: string;
  country: string;
}): string {
  const place = pack.state ? `${pack.city}/${pack.state}` : pack.city;
  if (pack.country && pack.country !== "BR") {
    return `${place} · ${pack.country}`;
  }
  return place;
}
