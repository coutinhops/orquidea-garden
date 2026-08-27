import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/funnel";
import { CTA, OptionCard, QuestionTitle, Screen, Silhouette } from "./bits";

export interface Option {
  value: string;
  label: string;
  desc?: string;
  icon?: string;
}

// ─── Pergunta de escolha única (auto-advance) ────────────────────────────────

export function SingleQuestion({
  title,
  sub,
  options,
  value,
  onAnswer,
  autoAdvance = true,
  ctaLabel,
}: {
  title: string;
  sub?: string;
  options: Option[];
  value?: string;
  onAnswer: (v: string) => void;
  autoAdvance?: boolean;
  ctaLabel?: string;
}) {
  // picked = escolha feita NESTA visita à tela (não auto-avança ao voltar)
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const selected = picked ?? value;
  // Trava anti-vazamento: ignora toques nos primeiros 500ms após montar
  // (evita que o toque/duplo-toque da pergunta anterior "atravesse" para esta)
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    if (picked && autoAdvance) {
      const t = setTimeout(() => onAnswer(picked), 380);
      return () => clearTimeout(t);
    }
  }, [picked, autoAdvance, onAnswer]);

  return (
    <Screen>
      <QuestionTitle title={title} sub={sub} />
      <div className="space-y-3">
        {options.map((o, i) => (
          <OptionCard
            key={o.value}
            index={i}
            label={o.label}
            desc={o.desc}
            icon={o.icon}
            selected={selected === o.value}
            onSelect={() => {
              if (Date.now() - mountedAt.current < 500) return;
              track("question_answered", { q: title, v: o.value });
              setPicked(o.value);
            }}
          />
        ))}
      </div>
      {!autoAdvance && (
        <CTA disabled={!selected} onClick={() => selected && onAnswer(selected)}>
          {ctaLabel ?? "Continuar"}
        </CTA>
      )}
    </Screen>
  );
}

// ─── Pergunta de múltipla escolha ────────────────────────────────────────────

export function MultiQuestion({
  title,
  sub,
  options,
  value,
  exclusive = [],
  disclaimer,
  onAnswer,
}: {
  title: string;
  sub?: string;
  options: Option[];
  value?: string[];
  exclusive?: string[]; // valores que limpam as demais seleções
  disclaimer?: string;
  onAnswer: (v: string[]) => void;
}) {
  const [picked, setPicked] = useState<string[]>(value ?? []);
  const mountedAt = useRef(Date.now());

  const toggle = (v: string) => {
    if (Date.now() - mountedAt.current < 500) return;
    setPicked((prev) => {
      let next: string[];
      if (prev.includes(v)) {
        next = prev.filter((x) => x !== v);
      } else if (exclusive.includes(v)) {
        next = [v];
      } else {
        next = [...prev.filter((x) => !exclusive.includes(x)), v];
      }
      track("question_answered", { q: title, v: next });
      return next;
    });
  };

  return (
    <Screen>
      <QuestionTitle title={title} sub={sub ?? "Escolha todas que se aplicam"} />
      <div className="space-y-3">
        {options.map((o, i) => (
          <OptionCard
            key={o.value}
            index={i}
            label={o.label}
            desc={o.desc}
            icon={o.icon}
            selected={picked.includes(o.value)}
            onSelect={() => toggle(o.value)}
          />
        ))}
      </div>
      {picked.length > 0 && (
        <p className="mt-3 animate-fade-up text-center text-[12px] font-semibold uppercase tracking-wider text-terra">
          {picked.length} {picked.length === 1 ? "selecionada" : "selecionadas"}
        </p>
      )}
      {disclaimer && (
        <p className="mt-4 text-center text-[11px] leading-relaxed text-ink/40">{disclaimer}</p>
      )}
      <CTA disabled={picked.length === 0} onClick={() => onAnswer(picked)}>
        Próximo passo
      </CTA>
    </Screen>
  );
}

// ─── Pergunta com silhuetas corporais ────────────────────────────────────────

export function SilhouetteQuestion({
  title,
  sub,
  options,
  value,
  onAnswer,
}: {
  title: string;
  sub?: string;
  options: Option[];
  value?: string;
  onAnswer: (v: string) => void;
}) {
  const [picked, setPicked] = useState<string | undefined>(value);

  useEffect(() => {
    if (picked) {
      const t = setTimeout(() => onAnswer(picked), 380);
      return () => clearTimeout(t);
    }
  }, [picked, onAnswer]);

  return (
    <Screen>
      <QuestionTitle title={title} sub={sub} />
      <div className="grid grid-cols-2 gap-3">
        {options.map((o, i) => (
          <button
            key={o.value}
            onClick={() => {
              track("question_answered", { q: title, v: o.value });
              setPicked(o.value);
            }}
            style={{ animationDelay: `${i * 70}ms` }}
            className={cn(
              "flex animate-fade-up flex-col items-center gap-1 rounded-2xl border bg-white px-3 pb-4 pt-5 transition-all",
              picked === o.value
                ? "border-terra bg-terra-faint shadow-[0_6px_20px_-8px_rgba(162,73,192,0.5)]"
                : "border-ink/10 hover:-translate-y-0.5 hover:border-terra/50"
            )}
          >
            <Silhouette
              variant={i}
              className={cn("transition-colors", picked === o.value ? "text-terra" : "text-ink/25")}
            />
            <span className="mt-2 text-center text-[13.5px] font-semibold leading-tight text-ink">
              {o.label}
            </span>
          </button>
        ))}
      </div>
    </Screen>
  );
}

// ─── Pergunta de dieta (opções agrupadas) ────────────────────────────────────

export function GroupedQuestion({
  title,
  sub,
  groups,
  value,
  onAnswer,
}: {
  title: string;
  sub?: string;
  groups: { label: string; options: Option[] }[];
  value?: string;
  onAnswer: (v: string) => void;
}) {
  const [picked, setPicked] = useState<string | undefined>(value);

  useEffect(() => {
    if (picked) {
      const t = setTimeout(() => onAnswer(picked), 380);
      return () => clearTimeout(t);
    }
  }, [picked, onAnswer]);

  return (
    <Screen>
      <QuestionTitle title={title} sub={sub} />
      <div className="space-y-5">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink/40">
              {g.label}
            </p>
            <div className="space-y-2.5">
              {g.options.map((o, i) => (
                <OptionCard
                  key={o.value}
                  index={i}
                  label={o.label}
                  desc={o.desc}
                  selected={picked === o.value}
                  onSelect={() => {
                    track("question_answered", { q: title, v: o.value });
                    setPicked(o.value);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
