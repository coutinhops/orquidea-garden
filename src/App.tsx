import { useEffect, useMemo, useState } from "react";
import { derive, track } from "@/lib/funnel";
import type { Answers } from "@/lib/funnel";
import { ProgressHeader, Screen } from "@/components/bits";
import { MultiQuestion, SingleQuestion } from "@/components/questions";
import { AnalyzingLoading } from "@/components/special";
import {
  ScratchScreen,
} from "@/components/results";
import { Checkout } from "@/components/checkout";
import { IMG } from "@/lib/images";

const { logo, age40, age50, age60, age70 } = {
  logo: IMG.logo,
  age40: IMG.age40,
  age50: IMG.age50,
  age60: IMG.age60,
  age70: IMG.age70,
};

// ─── Seções do funil (barra de progresso) ────────────────────────────────────

const SECTIONS = [
  { name: "Seu perfil", from: 2, to: 4 },
  { name: "Seu ambiente", from: 5, to: 8 },
  { name: "Suas preferências", from: 9, to: 11 },
];

const LAST_STEP = 10;

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

  // key={step} força a remontagem completa a cada etapa — sem isso o React
  // reutiliza o componente da pergunta anterior e o estado dela avança a próxima
  return (
    <div key={step} className="contents">
      {(() => {
        switch (step) {
    // ── 0 · Idade ───────────────────────────────────────────────────────────
    case 0:
      return (
        <Screen>
          <div className="mb-6 mt-6 animate-fade-up text-center">
            <img src={logo} alt="Orquídea Garden" fetchPriority="high" decoding="async" className="mx-auto h-24 w-auto" />
            <h1 className="mt-4 font-display text-[26px] font-semibold leading-tight text-ink">
              Perfil do Orquidófilo
            </h1>
            <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.22em] text-ink/50">
              Escolha a sua faixa de idade
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
            <span className="underline">Política de Privacidade</span> — Leia antes de continuar
          </p>
        </Screen>
      );

    // ── 1 · Prova social ────────────────────────────────────────────────────
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
            title="Qual é o seu principal objetivo com orquídeas?"
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

        case 3:
      return (
        <>
          {header}
          <SingleQuestion
            title="Onde as suas orquídeas vão morar?"
            options={[
              { value: "casa-quintal", label: "Casa com quintal", icon: "🏡" },
              { value: "ap-varanda", label: "Apartamento com varanda", icon: "🏢" },
              { value: "ap-janela", label: "Apartamento — perto das janelas", icon: "🪟" },
              { value: "casa-estufa", label: "Casa com estufa ou jardim de inverno", icon: "🌿" },
            ]}
            value={answers.homeType as string}
            onAnswer={answer("homeType")}
          />
        </>
      );

    // ── 4 · Luz ─────────────────────────────────────────────────────────────
    case 4:
      return (
        <>
          {header}
          <SingleQuestion
            title="Como é a luz do lugar onde elas vão ficar?"
            sub="Orquídeas amam luz indireta forte — sem sol direto nas folhas"
            options={[
              { value: "muita", label: "Muita luz o dia todo", icon: "☀️" },
              { value: "media", label: "Boa luz por algumas horas", icon: "⛅" },
              { value: "pouca", label: "Pouca luz natural", icon: "🌥️" },
              { value: "nao-sei", label: "Não sei dizer", icon: "🤔" },
            ]}
            value={answers.light as string}
            onAnswer={answer("light")}
          />
        </>
      );

        case 5:
      return (
        <>
          {header}
          <MultiQuestion
            title="Quais espécies você mais gostaria de ter?"
            sub="Escolha todas que encantam você — a estufa monta o mix"
            options={[
              { value: "phalaenopsis", label: "Phalaenopsis", desc: "A clássica — floresce 2x ao ano", icon: "🦋" },
              { value: "cattleya", label: "Cattleya", desc: "Rainha das orquídeas — flores perfumadas", icon: "👑" },
              { value: "dendrobium", label: "Dendrobium", desc: "Cascatas de flores delicadas", icon: "🎋" },
              { value: "todas", label: "Mix surpresa da estufa", desc: "Variedades escolhidas para o seu perfil", icon: "🎁" },
            ]}
            exclusive={["todas"]}
            value={answers.species as string[]}
            onAnswer={answer("species")}
          />
        </>
      );

        case 6:
      return (
        <>
          {header}
          <MultiQuestion
            title="O que mais frustra você no cultivo de plantas?"
            options={[
              { value: "folhas-amarelas", label: "Folhas amarelando do nada", icon: "🟡" },
              { value: "raizes-podres", label: "Raízes apodrecendo", icon: "🥀" },
              { value: "nunca-floresce", label: "Planta bonita, mas nunca floresce", icon: "🍃" },
              { value: "pragas", label: "Pragas e cochonilhas", icon: "🐛" },
              { value: "floricultura", label: "Flor da loja murcha em semanas", icon: "🏪" },
              { value: "nada", label: "Nenhuma dessas", icon: "😌" },
            ]}
            exclusive={["nada"]}
            disclaimer="Seu guia digital inclui um capítulo de solução para cada item selecionado."
            value={answers.frustrations as string[]}
            onAnswer={answer("frustrations")}
          />
        </>
      );

    // ── 12 · Loading de análise ─────────────────────────────────────────────
    case 7:
      return <AnalyzingLoading onDone={next} />;

    // ── 13 · Caminho da primeira floração ───────────────────────────────────
    case 8:
      return (
        <NameScreen
          value={answers.name as string}
          onNext={(name) => {
            save("name", name);
            next();
          }}
        />
      );

    // ── 17 · Kit reservado ──────────────────────────────────────────────────
    case 9:
      return <KitReadyScreen d={d} onNext={next} />;

    // ── 10 · Raspadinha → checkout ──────────────────────────────────────────
    case 10:
      return (
        <ScratchScreen
          onDone={() => {
            track("quiz_completed");
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
