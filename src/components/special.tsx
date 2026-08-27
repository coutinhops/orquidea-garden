import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/funnel";
import { Screen, Stars } from "./bits";

// ─── Loading sequencial "Analisando suas respostas" ──────────────────────────

const ANALYSIS_STEPS = ["Seu Perfil", "Seu Ambiente", "Seus Cuidados", "Suas Preferências"];

export function AnalyzingLoading({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    track("loading_started", { t: "analysis" });
    const total = 8500;
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / total);
      setProgress(p * ANALYSIS_STEPS.length);
      if (p >= 1) {
        clearInterval(id);
        track("loading_complete", { t: "analysis" });
        setTimeout(onDone, 500);
      }
    }, 80);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <Screen className="justify-center">
      <div className="animate-fade-up">
        <div className="mx-auto mb-8 grid size-16 animate-pulse-soft place-items-center rounded-full bg-terra-faint text-3xl">
          🌸
        </div>
        <h1 className="text-center font-display text-2xl font-semibold text-ink">
          Analisando suas respostas…
        </h1>
        <div className="mt-8 space-y-4">
          {ANALYSIS_STEPS.map((s, i) => {
            const p = Math.min(1, Math.max(0, progress - i));
            return (
              <div key={s}>
                <div className="mb-1.5 flex items-center justify-between text-[13px] font-semibold">
                  <span className={cn(p > 0 ? "text-ink" : "text-ink/35")}>{s}</span>
                  <span className={cn(p >= 1 ? "text-sage-dark" : "text-ink/35")}>
                    {p >= 1 ? "✓" : `${Math.round(p * 100)}%`}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-150",
                      p >= 1 ? "bg-sage" : "bg-terra"
                    )}
                    style={{ width: `${p * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 rounded-2xl border border-ink/10 bg-white px-5 py-4 text-center">
          <Stars className="justify-center" />
          <p className="mt-2 text-[13px] font-semibold text-ink">
            Mais de 180 mil mudas enviadas para todo o Brasil
          </p>
          <p className="text-[12px] text-ink/50">Estufa própria · envio com garantia de chegada viva</p>
        </div>
      </div>
    </Screen>
  );
}

// ─── Loading circular "Montando seu kit" ─────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Cleusa, 61",
    result: "12 florações este ano",
    text: "Matei 4 orquídeas antes de entender que rega demais era o problema. Com o calendário do kit, minhas phalaenopsis florescem duas vezes por ano.",
  },
  {
    name: "Nelson, 58",
    result: "Varanda virou estufa",
    text: "Comecei com o kit de 10 sem saber nada. Dois anos depois, minha varanda tem 27 vasos e vizinho bate na porta para pedir muda.",
  },
  {
    name: "Márcia, 47",
    result: "Presente que virou paixão",
    text: "Comprei o kit para presentear minha mãe de 70 anos. Hoje nós duas cuidamos juntas — virou nosso programa de domingo.",
  },
];

export function PlanLoading({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [tIdx, setTIdx] = useState(0);
  const done = pct >= 100;

  useEffect(() => {
    track("loading_started", { t: "kit" });
    const total = 9500;
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / total) * 100);
      setPct(Math.floor(p));
      if (p >= 100) {
        clearInterval(id);
        track("loading_complete", { t: "kit" });
        setTimeout(onDone, 1600);
      }
    }, 90);
    const tid = setInterval(() => setTIdx((i) => (i + 1) % TESTIMONIALS.length), 3500);
    return () => {
      clearInterval(id);
      clearInterval(tid);
    };
  }, [onDone]);

  const R = 56;
  const C = 2 * Math.PI * R;
  const t = TESTIMONIALS[tIdx];

  return (
    <Screen className="justify-center">
      <div className="animate-fade-up text-center">
        {!done ? (
          <>
            <div className="relative mx-auto size-36">
              <svg viewBox="0 0 128 128" className="size-36 -rotate-90">
                <circle cx="64" cy="64" r={R} fill="none" stroke="#1C19171A" strokeWidth="8" />
                <circle
                  cx="64"
                  cy="64"
                  r={R}
                  fill="none"
                  stroke="#A249C0"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C - (C * pct) / 100}
                  className="transition-all duration-150"
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-display text-3xl font-semibold text-ink">
                {pct}%
              </span>
            </div>
            <h1 className="mt-6 font-display text-[22px] font-semibold text-ink">
              Montando seu Kit da Floração personalizado
            </h1>
            <p className="mt-2 text-[14px] text-ink/55">
              <strong className="font-semibold text-terra">212.000 pessoas</strong> já receberam
              mudas da Orquídea Garden em casa
            </p>
            <div key={tIdx} className="mt-8 animate-fade-up rounded-2xl border border-ink/10 bg-white px-5 py-4 text-left">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold text-ink">{t.name}</p>
                <span className="rounded-full bg-sage-faint px-2.5 py-1 text-[11px] font-bold text-sage-dark">
                  {t.result}
                </span>
              </div>
              <Stars n={5} className="mt-1" />
              <p className="mt-2 text-[13px] leading-relaxed text-ink/65">“{t.text}”</p>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-ink/40">
              Mudas pré-adultas: a primeira floração acontece em média entre 12 e 24 meses, com os
              cuidados do guia. Resultados variam conforme ambiente e dedicação.
            </p>
          </>
        ) : (
          <div className="animate-pop-in">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-sage text-4xl">
              🌸
            </div>
            <h1 className="mt-6 font-display text-[22px] font-semibold text-ink">
              Seu Kit da Floração está reservado!
            </h1>
          </div>
        )}
      </div>
    </Screen>
  );
}
