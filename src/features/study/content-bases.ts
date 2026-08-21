export type ContentBaseStatus = "open" | "soon";

export interface ContentBase {
  id: string;
  courseSlug: string | null;
  title: string;
  subtitle: string;
  status: ContentBaseStatus;
}

export const DEFAULT_BASE_ID = "teorico";

export const CONTENT_BASES: ContentBase[] = [
  {
    id: "teorico",
    courseSlug: "defesa-civil-lgnd",
    title: "Material teórico",
    subtitle: "80/20 da apostila e da plataforma",
    status: "open",
  },
  {
    id: "aula-1",
    courseSlug: "aula-1-brec-nos",
    title: "Aula 1",
    subtitle: "BREC e NOS · segunda 17/08",
    status: "open",
  },
  {
    id: "aula-2",
    courseSlug: "aula-2-aguas-rapidas",
    title: "Aula 2",
    subtitle: "Águas rápidas · terça 18/08",
    status: "open",
  },
  {
    id: "aula-3",
    courseSlug: "aula-3-combate-incendio",
    title: "Aula 3",
    subtitle: "Combate a incêndio · quarta 19/08",
    status: "open",
  },
  {
    id: "aula-4",
    courseSlug: "aula-4-primeiros-socorros",
    title: "Aula 4",
    subtitle: "Primeiros socorros · quinta 20/08",
    status: "open",
  },
];

export function baseById(id: string | null | undefined): ContentBase {
  return CONTENT_BASES.find((item) => item.id === id) ?? CONTENT_BASES[0]!;
}
