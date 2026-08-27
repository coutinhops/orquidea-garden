// ─── Orquídea Garden · núcleo de personalização do funil ─────────────────────

export type Answers = Record<string, string | string[] | number | boolean | undefined>;

export interface Diagnosis {
  id: string;
  title: string;
  copy: string;
  promise: string;
  cardLabel: string;
  cardValue: string;
  risk: string;
}

// ─── Labels ──────────────────────────────────────────────────────────────────

export const AGE_LABELS: Record<string, string> = {
  "40-49": "casa dos 40 anos",
  "50-59": "casa dos 50 anos",
  "60-69": "casa dos 60 anos",
  "70+": "casa dos 70 anos",
};

export const AGE_NUMBER: Record<string, string> = {
  "40-49": "38.000",
  "50-59": "52.000",
  "60-69": "61.000",
  "70+": "29.000",
};

export const GOAL_LABELS: Record<string, string> = {
  flor: "Ter florações o ano todo",
  parar: "Parar de perder plantas",
  colecao: "Montar uma coleção",
  presente: "Presentear alguém especial",
};

export const SPECIES_LABELS: Record<string, string> = {
  phalaenopsis: "Phalaenopsis",
  cattleya: "Cattleya",
  cymbidium: "Cymbidium",
  dendrobium: "Dendrobium",
  vanda: "Vanda",
  todas: "Todas",
};

export const HOME_LABELS: Record<string, string> = {
  "casa-quintal": "casa com quintal",
  "ap-varanda": "apartamento com varanda",
  "ap-janela": "apartamento com janelas",
  "casa-estufa": "casa com estufa ou jardim",
};

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function joinPt(items: string[]): string {
  const clean = items.filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(", ")} e ${clean[clean.length - 1]}`;
}

// ─── Matriz de diagnósticos do orquidófilo (ordem = prioridade) ──────────────

export function resolveDiagnosis(a: Answers): Diagnosis {
  const watering = a.watering as string;
  const light = a.light as string;
  const substrate = a.substrate as string;
  const lost = a.lost as string;

  if (watering === "todo-dia" || watering === "2-3x") {
    return {
      id: "regador-ansioso",
      title: "Regador Ansioso",
      copy: "O excesso de água é a causa nº 1 de morte de orquídeas no Brasil: as raízes apodrecem por baixo do substrato muito antes de a folha amarelar. A boa notícia: com o calendário de rega por espécie que acompanha o kit, você nunca mais afoga uma orquídea.",
      promise: "Calendário de rega por espécie + mudas resistentes ao inverno",
      cardLabel: "Perfil de rega",
      cardValue: "Ansioso",
      risk: "Sem ajustar a rega, 8 em cada 10 orquídeas morrem por apodrecimento de raízes — mesmo parecendo saudáveis por fora.",
    };
  }
  if (light === "pouca" || light === "nao-sei") {
    return {
      id: "orquidea-na-escuridao",
      title: "Orquídea na Escuridão",
      copy: "Orquídea sem luz indireta forte vive, mas não floresce — é por isso que tantas plantas ficam anos 'só na folha'. A boa notícia: as variedades deste kit foram selecionadas justamente por florescerem bem em luz de janela e varanda.",
      promise: "Variedades que florescem em luz de janela",
      cardLabel: "Perfil de luz",
      cardValue: "Insuficiente",
      risk: "Sem luz adequada, a orquídea sobrevive mas nunca emite haste floral — e cada ano sem flor aumenta a chance de desistência.",
    };
  }
  if (substrate === "terra" || substrate === "nao-sei") {
    return {
      id: "raizes-sufocadas",
      title: "Raízes Sufocadas",
      copy: "Orquídeas são epífitas: na natureza vivem presas em árvores, com as raízes ao ar. Em terra comum, elas sufocam e apodrecem. A boa notícia: as mudas do kit já vêm no substrato ideal — e o guia mostra quando e como trocar.",
      promise: "Mudas já no substrato ideal + guia de replantio",
      cardLabel: "Perfil de substrato",
      cardValue: "Sufocado",
      risk: "Em substrato errado, as raízes perdem a capacidade de absorver nutrientes — a planta definha mesmo com água e luz corretas.",
    };
  }
  if (lost === "3-5" || lost === "conta") {
    return {
      id: "ciclo-da-frustracao",
      title: "Ciclo da Frustração",
      copy: "Comprar orquídeas adultas floridas — que vieram de estufas perfeitas — quase sempre termina da mesma forma: as flores caem e a planta não se adapta à sua casa. A boa notícia: mudas pré-adultas crescem já aclimatadas ao SEU ambiente — é o segredo dos colecionadores.",
      promise: "Mudas que se adaptam à sua casa desde cedo",
      cardLabel: "Histórico",
      cardValue: "Frustração",
      risk: "Repetir a compra de plantas adultas de floricultura mantém o ciclo: flor bonita por 2 meses, depois perda da planta.",
    };
  }
  return {
    id: "colecionador-em-potencial",
    title: "Colecionador em Potencial",
    copy: "Seu ambiente e sua rotina estão acima da média — o que falta é variedade certa e um método de condução. A boa notícia: com as variedades selecionadas do kit e o guia do seu perfil, sua coleção ganha florações em todas as estações.",
    promise: "Variedades selecionadas para o seu ambiente",
    cardLabel: "Potencial",
    cardValue: "Colecionador",
    risk: "Sem variedades com épocas de floração diferentes, a coleção fica 'só na folha' na maior parte do ano.",
  };
}

// ─── Derivados da sessão ─────────────────────────────────────────────────────

export interface Derived {
  ageLabel: string;
  ageNumber: string;
  goalLabel: string;
  diagnosis: Diagnosis;
  name: string;
  levelLabel: string;
  speciesLabel: string;
  homeLabel: string;
  bloomLabel: string;
}

export function derive(a: Answers): Derived {
  const ageBucket = (a.ageBucket as string) ?? "50-59";
  const experience = a.experience as string;
  const species = ((a.species as string[]) ?? [])
    .filter((s) => s !== "todas")
    .map((s) => SPECIES_LABELS[s] ?? s);

  const bloom = new Date();
  bloom.setMonth(bloom.getMonth() + 14);
  const bloomLabel = `${MESES[bloom.getMonth()]} de ${bloom.getFullYear()}`;

  const levelLabel =
    experience === "nunca"
      ? "Iniciante"
      : experience === "tentei"
        ? "Iniciante resiliente"
        : "Já cultiva";

  return {
    ageLabel: AGE_LABELS[ageBucket] ?? AGE_LABELS["50-59"],
    ageNumber: AGE_NUMBER[ageBucket] ?? AGE_NUMBER["50-59"],
    goalLabel: GOAL_LABELS[(a.goal as string) ?? "flor"] ?? GOAL_LABELS.flor,
    diagnosis: resolveDiagnosis(a),
    name: ((a.name as string) ?? "").trim(),
    levelLabel,
    speciesLabel: species.length ? joinPt(species) : "variedades sortidas",
    homeLabel: HOME_LABELS[(a.homeType as string) ?? "ap-varanda"] ?? HOME_LABELS["ap-varanda"],
    bloomLabel,
  };
}

// ─── Tracking (leve, client-side) ────────────────────────────────────────────

export function track(event: string, data?: Record<string, unknown>) {
  console.debug(`[track] ${event}`, data ?? {});
}

export function vibrate(ms = 12) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* noop */
  }
}

export const PROMO_CODE = "INVERNO90";
export const BRAND = "Orquídea Garden";
