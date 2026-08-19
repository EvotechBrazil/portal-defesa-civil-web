export interface CardArt {
  src: string;
  alt: string;
}

const AULA_1: Record<string, CardArt> = {
  "#2": { src: "/study/aula-1/nos.jpg", alt: "Representação visual do NOS" },
  "#3": { src: "/study/aula-1/nos.jpg", alt: "Representação visual do NOS" },
  "#4": { src: "/study/aula-1/nos.jpg", alt: "Representação visual do NOS" },
  "#5": {
    src: "/study/aula-1/tres-pontos.jpg",
    alt: "Demonstração visual dos três pontos de fixação",
  },
  "#6": { src: "/study/aula-1/apito.jpg", alt: "Apito usado na comunicação da equipe" },
  "#7": {
    src: "/study/aula-1/chamada.jpg",
    alt: "Procedimento visual de chamada e conferência",
  },
  "#8": {
    src: "/study/aula-1/chamada.jpg",
    alt: "Procedimento visual de chamada e conferência",
  },
  "#9": { src: "/study/aula-1/croqui.jpg", alt: "Exemplo de croqui operacional" },
  "#10": {
    src: "/study/aula-1/checklist.jpg",
    alt: "Exemplo de lista de verificação operacional",
  },
};

const AULA_2: Record<string, CardArt> = {
  "#1": {
    src: "/study/aula-2/piramide.jpg",
    alt: "Pirâmide de prioridades no salvamento em águas rápidas",
  },
  "#2": {
    src: "/study/aula-2/pilares.jpg",
    alt: "Pilares do salvamento em águas rápidas",
  },
  "#3": {
    src: "/study/aula-2/epi.jpg",
    alt: "Equipamentos de proteção individual para águas rápidas",
  },
  "#4": {
    src: "/study/aula-2/impacto.jpg",
    alt: "Representação do impacto da correnteza",
  },
  "#5": {
    src: "/study/aula-2/ameacas.jpg",
    alt: "Ameaças encontradas em ambientes de águas rápidas",
  },
  "#6": {
    src: "/study/aula-2/hidraulica.jpg",
    alt: "Comportamento hidráulico da água em movimento",
  },
  "#7": {
    src: "/study/aula-2/angulo.jpg",
    alt: "Ângulo de deslocamento em correnteza",
  },
  "#8": {
    src: "/study/aula-2/formacoes.jpg",
    alt: "Formações usadas pela equipe em águas rápidas",
  },
  "#9": {
    src: "/study/aula-2/throwbag.jpg",
    alt: "Lançamento de bolsa de resgate com corda",
  },
  "#10": {
    src: "/study/aula-2/termico.jpg",
    alt: "Proteção térmica para operação em águas rápidas",
  },
};

export function cardArt(
  courseSlug: string | null | undefined,
  code: string,
): CardArt | null {
  if (courseSlug === "aula-1-brec-nos") {
    return AULA_1[code] ?? null;
  }
  if (courseSlug === "aula-2-aguas-rapidas") {
    return AULA_2[code] ?? null;
  }
  return null;
}
