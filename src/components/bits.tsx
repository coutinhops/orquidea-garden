import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Check, ChevronLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { vibrate } from "@/lib/funnel";

// ─── Moldura do funil (mobile-first, centralizada) ───────────────────────────

export function Screen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-cream min-h-dvh sm:border-x sm:border-ink/5 sm:shadow-[0_0_80px_-24px_rgba(28,25,23,0.35)]">
      <div
        className={cn("flex flex-1 flex-col px-5 pb-8", className)}
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Cabeçalho com progresso segmentado por seção ────────────────────────────

export interface ProgressInfo {
  section: string;
  sectionIndex: number; // 0-based
  totalSections: number;
  ratio: number; // 0..1 dentro do funil
}

export function ProgressHeader({
  info,
  onBack,
}: {
  info: ProgressInfo;
  onBack?: () => void;
}) {
  return (
    <div
      className="sticky top-0 z-20 -mx-5 bg-cream/95 px-5 pb-3 pt-4 backdrop-blur"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Voltar"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/10 bg-white text-ink transition hover:bg-terra-faint"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <div className="size-9 shrink-0" />
        )}
        <div className="flex-1">
          <div className="flex gap-1">
            {Array.from({ length: info.totalSections }).map((_, i) => (
              <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                <div
                  className={cn(
                    "h-full rounded-full bg-terra transition-all duration-500",
                    i < info.sectionIndex && "w-full",
                    i > info.sectionIndex && "w-0"
                  )}
                  style={
                    i === info.sectionIndex
                      ? { width: `${Math.round(info.ratio * 100)}%` }
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
            {info.section}
          </p>
        </div>
        <div className="size-9 shrink-0" />
      </div>
    </div>
  );
}

// ─── Tipos de pergunta ───────────────────────────────────────────────────────

export function QuestionTitle({
  title,
  sub,
}: {
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div className="mb-6 mt-4 animate-fade-up">
      <h1 className="text-balance font-display text-[26px] font-semibold leading-tight text-ink">
        {title}
      </h1>
      {sub && <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{sub}</p>}
    </div>
  );
}

export function OptionCard({
  label,
  desc,
  selected,
  onSelect,
  index = 0,
  icon,
}: {
  label: ReactNode;
  desc?: string;
  selected: boolean;
  onSelect: () => void;
  index?: number;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={() => {
        vibrate();
        onSelect();
      }}
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "group flex w-full animate-fade-up items-center gap-3 rounded-2xl border bg-white px-4 py-4 text-left transition-all duration-200",
        selected
          ? "border-terra bg-terra-faint shadow-[0_6px_20px_-8px_rgba(162,73,192,0.5)]"
          : "border-ink/10 hover:-translate-y-0.5 hover:border-terra/50 hover:shadow-[0_10px_24px_-12px_rgba(28,25,23,0.25)]"
      )}
    >
      {icon && <span className="shrink-0 text-2xl">{icon}</span>}
      <span className="flex-1">
        <span className="block text-[15px] font-semibold text-ink">{label}</span>
        {desc && <span className="mt-0.5 block text-[13px] text-ink/55">{desc}</span>}
      </span>
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all",
          selected ? "border-terra bg-terra" : "border-ink/15 bg-white"
        )}
      >
        {selected && <Check className="size-3.5 text-white" strokeWidth={3.5} />}
      </span>
    </button>
  );
}

// ─── CTA padrão ──────────────────────────────────────────────────────────────

export function CTA({
  children = "Continuar",
  onClick,
  disabled,
  secondary,
  className,
}: {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  secondary?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-auto pt-6", className)}>
      <button
        disabled={disabled}
        onClick={() => {
          vibrate();
          onClick?.();
        }}
        className={cn(
          "w-full rounded-full bg-cta py-4 text-[15px] font-bold uppercase tracking-[0.12em] text-cream transition-all",
          disabled
            ? "cursor-not-allowed opacity-30"
            : "hover:bg-ink active:scale-[0.98]"
        )}
      >
        {children}
      </button>
      {secondary && <div className="mt-3 text-center">{secondary}</div>}
    </div>
  );
}

// ─── Interstitial base ───────────────────────────────────────────────────────

export function InterstitialBody({
  kicker,
  children,
  image,
  checks,
}: {
  kicker?: string;
  children: ReactNode;
  image?: { src: string; alt: string };
  checks?: string[];
}) {
  return (
    <div className="mt-2 flex flex-1 flex-col">
      {kicker && (
        <p className="mb-3 animate-fade-up text-[11px] font-bold uppercase tracking-[0.22em] text-terra">
          {kicker}
        </p>
      )}
      <div className="animate-fade-up text-[17px] leading-relaxed text-ink/85 [&_strong]:font-display [&_strong]:text-[19px] [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
      {checks && (
        <ul className="mt-5 space-y-3">
          {checks.map((c, i) => (
            <li
              key={i}
              style={{ animationDelay: `${200 + i * 120}ms` }}
              className="flex animate-fade-up items-start gap-3 rounded-xl border border-sage/25 bg-sage-faint px-4 py-3"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage">
                <Check className="size-3 text-white" strokeWidth={3.5} />
              </span>
              <span className="text-[14px] font-medium leading-snug text-ink/80">{c}</span>
            </li>
          ))}
        </ul>
      )}
      {image && (
        <div className="mt-6 animate-fade-up overflow-hidden rounded-2xl" style={{ animationDelay: "150ms" }}>
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
        </div>
      )}
    </div>
  );
}

// ─── Silhuetas corporais (SVG neutras) ───────────────────────────────────────

export function Silhouette({ variant, className }: { variant: number; className?: string }) {
  // 4 biotipos: 0 magra, 1 média, 2 grande, 3 acima do peso
  const widths = [16, 22, 30, 38];
  const hips = [18, 24, 32, 40];
  const w = widths[variant] ?? 22;
  const hp = hips[variant] ?? 24;
  return (
    <svg viewBox="0 0 100 200" className={cn("h-28 w-auto", className)} fill="currentColor">
      <circle cx="50" cy="18" r="12" />
      <path
        d={`M50 34
           C ${50 - w} 36, ${50 - w - 4} 52, ${50 - w + 2} 66
           C ${50 - hp} 82, ${50 - hp - 2} 96, ${50 - hp + 4} 108
           L ${50 - 14} 108 C ${50 - 16} 130, ${50 - 15} 160, ${50 - 14} 188
           L ${50 - 6} 188 C ${50 - 8} 160, ${50 - 9} 130, ${50 - 7} 108
           L ${50 + 7} 108 C ${50 + 9} 130, ${50 + 8} 160, ${50 + 6} 188
           L ${50 + 14} 188 C ${50 + 15} 160, ${50 + 16} 130, ${50 + 14} 108
           L ${50 + hp - 4} 108 C ${50 + hp + 2} 96, ${50 + hp} 82, ${50 + w - 2} 66
           C ${50 + w + 4} 52, ${50 + w} 36, 50 34 Z`}
      />
    </svg>
  );
}

// ─── Estrelas de avaliação ───────────────────────────────────────────────────

export function Stars({ n = 5, className }: { n?: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-[#E9A13C]", className)}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4 fill-current">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

// ─── Nota de privacidade ─────────────────────────────────────────────────────

export function PrivacyNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-[12px] leading-relaxed text-ink/45">
      <Lock className="mt-0.5 size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

// ─── Countdown persistente ───────────────────────────────────────────────────

export function useCountdown(minutes = 9) {
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    const KEY = "vp-deadline";
    let deadline = Number(localStorage.getItem(KEY));
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + minutes * 60 * 1000;
      localStorage.setItem(KEY, String(deadline));
    }
    const tick = () => setLeft(Math.max(0, Math.round((deadline - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [minutes]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
