const AULA_1: Record<string, string> = {
  "#2": "/study/aula-1/nos.jpg",
  "#3": "/study/aula-1/nos.jpg",
  "#4": "/study/aula-1/nos.jpg",
  "#5": "/study/aula-1/tres-pontos.jpg",
  "#6": "/study/aula-1/apito.jpg",
  "#7": "/study/aula-1/chamada.jpg",
  "#8": "/study/aula-1/chamada.jpg",
  "#9": "/study/aula-1/croqui.jpg",
  "#10": "/study/aula-1/checklist.jpg",
};

const AULA_2: Record<string, string> = {
  "#1": "/study/aula-2/piramide.jpg",
  "#2": "/study/aula-2/pilares.jpg",
  "#3": "/study/aula-2/epi.jpg",
  "#4": "/study/aula-2/impacto.jpg",
  "#5": "/study/aula-2/ameacas.jpg",
  "#6": "/study/aula-2/hidraulica.jpg",
  "#7": "/study/aula-2/angulo.jpg",
  "#8": "/study/aula-2/formacoes.jpg",
  "#9": "/study/aula-2/throwbag.jpg",
  "#10": "/study/aula-2/termico.jpg",
};

export function cardArt(
  courseSlug: string | null | undefined,
  code: string,
): string | null {
  if (courseSlug === "aula-1-brec-nos") {
    return AULA_1[code] ?? null;
  }
  if (courseSlug === "aula-2-aguas-rapidas") {
    return AULA_2[code] ?? null;
  }
  return null;
}
