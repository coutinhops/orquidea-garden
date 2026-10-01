import { useEffect, useMemo, useState } from "react";
import { derive, track } from "@/lib/funnel";
import type { Answers } from "@/lib/funnel";
import { CTA, InterstitialBody, ProgressHeader, Screen } from "@/components/bits";
import { MultiQuestion, SingleQuestion } from "@/components/questions";
import { AnalyzingLoading } from "@/components/special";
import {
  BloomTimeline,
  KitReadyScreen,
  NameScreen,
  ScratchScreen,
} from "@/components/results";
import { Checkout } from "@/components/checkout";
import { IMG } from "@/lib/images";

const { logo, age40, age50, age60, age70, hero } = {
  logo: IMG.logo,
  age40: IMG.age40,
  age50: IMG.age50,
  age60: IMG.age60,
  age70: IMG.age70,
  hero: IMG.hero,
};

// ─── Seções do funil (barra de progresso) ────────────────────────────────────
const SECTIONS = [
  { name: "Seu perfil", from: 1, to: 2 },
  { name: "Seu ambiente", from: 3, to: 4 },
  { name: "Suas preferências", from: 5, to: 5 },
];

const LAST_STEP = 8;

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [view, setView] = useState<"quiz" | "checkout">("quiz");
  const d = useMemo(() => derive(answers), [answers]);

  useEffect(() => {
    track("quiz_start");
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const save = (key: string, v: Answers[string]) => setAnswers((a) => ({ ...a, [key]: v }));
  const next = () => setStep((s) => Math.min(s + 1, LAST_STEP));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const answer = (key: string) => (v: Answers[string]) => {
    save(key, v);
    next();
  };

  const section = SECTIONS.find((s) => step >= s.from && step <= s.to);
  const sectionIndex = section ? SECTIONS.indexOf(section) : 0;
  const header = section ? (
    <ProgressHeader
      info={{
        section: section.name,
        sectionIndex,
        totalSections: SECTIONS.length,
        ratio: (step - section.from + 1) / (section.to - section.from + 1),
      }}
      onBack={step > 0 ? back : undefined}
    />
  ) : null;

  if (view === "checkout") return <Checkout d={d} />;

  return (
    <div key={step} className="contents">
      {(() => {
        switch (step) {
    // ── 0 · Landing enxuta ──────────────────────────────────────────────────
    case 0:
      return (
        <Screen>
          <div className="mb-6 mt-6 animate-fade-up text-center">
            <img src={logo} alt="Orquídea Garden" fetchPriority="high" decoding="async" className="mx-auto h-24 w-auto" />
            <h1 className="mt-4 font-display text-[26px] font-semibold leading-tight text-ink">
              Descubra seu perfil de orquidófilo
            </h1>
            <p className="mt-2 text-[14px] text-ink/60">
              Responda 5 perguntas rápidas e descubra o kit perfeito para você — com até <strong>90% de desconto</strong>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: "40-49", label: "40–49 anos", img: age40 },
              { v: "50-59", label: "50–59 anos", img: age50 },
              { v: "60-69", label: "60–69 anos", img: age60 },
              { v: "70+", label: "70 anos ou mais", img: age70 },
            ].map((o, i) => (
              <button
                key={o.v}
                onClick={() => answer("ageBucket")(o.v)}
                style={{ animationDelay: `${i * 80}ms` }}
                className="group animate-fade-up overflow-hidden rounded-2xl border border-ink/10 bg-white text-left transition-all hover:-translate-y-1 hover:border-terra/60 hover:shadow-[0_16px_36px_-16px_rgba(28,25,23,0.35)] active:scale-[0.97]"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={o.img}
                    alt={o.label}
                    fetchPriority="high"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="py-3 text-center text-[14px] font-bold text-ink">{o.label}</p>
              </button>
            ))}
          </div>
          <p className="mt-6 text-center text-[11px] leading-relaxed text-ink/40">
            Ao continuar, você concorda com nossos{" "}
            <span className="underline">Termos de Serviço</span> |{" "}
            <span className="underline">Política de Privacidade</span>
          </p>
        </Screen>
      );

    // ── 1 · Experiência ─────────────────────────────────────────────────────
    case 1:
      return (
        <>
          {header}
          <SingleQuestion
            title="Como é a sua experiência com orquídeas?"
            options={[
              { value: "sim", label: "Tenho (ou já tive) orquídeas", icon: "🌸" },
              { value: "tentei", label: "Já tentei, mas não deu muito certo", icon: "🍂" },
              { value: "nunca", label: "Nunca cuidei de orquídeas", icon: "🌱" },
            ]}
            value={answers.experience as string}
            onAnswer={answer("experience")}
          />
        </>
      );

    // ── 2 · Objetivo principal ──────────────────────────────────────────────
    case 2:
      return (
        <>
          {header}
          <SingleQuestion
            title="Qual é o seu principal objetivo?"
            options={[
              { value: "flor", label: "Ter florações o ano todo", icon: "🌸" },
              { value: "parar", label: "Parar de perder plantas", icon: "🛡️" },
              { value: "colecao", label: "Montar uma coleção de variedades", icon: "🏺" },
              { value: "presente", label: "Presentear alguém especial", icon: "🎁" },
            ]}
            value={answers.goal as string}
            onAnswer={answer("goal")}
          />
        </>
      );

    // ── 3 · Ambiente (casa + luz juntos) ────────────────────────────────────
    case 3:
      return (
        <>
          {header}
          <SingleQuestion
            title="Onde as suas orquídeas vão morar?"
            sub="Escolha o ambiente que mais se parece com o seu"
            options={[
              { value: "casa-quintal", label: "Casa com quintal ensolarado", icon: "🏡" },
              { value: "ap-varanda", label: "Apartamento com varanda", icon: "🏢" },
              { value: "ap-janela", label: "Apartamento — luz das janelas", icon: "🪟" },
              { value: "casa-estufa", label: "Casa com estufa ou jardim de inverno", icon: "🌿" },
            ]}
            value={answers.homeType as string}
            onAnswer={(v) => {
              save("homeType", v);
              // Define luz automaticamente baseado no ambiente
              const lightMap: Record<string, string> = {
                "casa-quintal": "muita",
                "ap-varanda": "media",
                "ap-janela": "pouca",
                "casa-estufa": "media",
              };
              save("light", lightMap[v as string] || "media");
              next();
            }}
          />
        </>
      );

    // ── 4 · Maior desafio (consolida rega + substrato + perdas + frustrações) ─
    case 5:
      return (
        <>
          {header}
          <MultiQuestion
            title="Quais espécies você mais gostaria de ter?"
            sub="Escolha todas que encantam você — a estufa monta o mix"
            options={[
              { value: "phalaenopsis", label: "Phalaenopsis (a clássica de casa)", icon: "🌸" },
              { value: "cattleya", label: "Cattleya (flor grande e perfumada)", icon: "🌺" },
              { value: "dendrobium", label: "Dendrobium (colorida e fácil)", icon: "🌼" },
              { value: "oncidium", label: "Oncidium (cascata de flores)", icon: "🌾" },
              { value: "vanda", label: "Vanda (exótica e vistosa)", icon: "🪷" },
              { value: "todas", label: "Quero conhecer todas as variedades!", icon: "🎁" },
            ]}
            value={answers.species as string[]}
            onAnswer={answer("species")}
          />
        </>
      );

    // ── 6 · Loading único ────────────────────────────────────────────────────
    case 6:
      return <AnalyzingLoading onDone={next} />;

    // ── 7 · Oferta + Nome (juntos) ──────────────────────────────────────────
    case 8:
      return (
        <ScratchScreen
          onDone={() => {
            track("scratch_done", { code: d.promoCode });
            setView("checkout");
          }}
        />
      );

    default:
      return null;
        }
      })()}
    </div>
  );
}
