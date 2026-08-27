import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PROMO_CODE, track } from "@/lib/funnel";
import type { Derived } from "@/lib/funnel";
import { CTA, PrivacyNote, QuestionTitle, Screen } from "./bits";

// ─── Perfil de orquidófilo (dashboard) ───────────────────────────────────────

export function ProfileDashboard({ d, onNext }: { d: Derived; onNext: () => void }) {
  useEffect(() => {
    track("diagnosis_viewed", { id: d.diagnosis.id });
  }, [d.diagnosis.id]);

  const cards = [
    { label: d.diagnosis.cardLabel, value: d.diagnosis.cardValue, alert: true },
    { label: "Nível", value: d.levelLabel },
    { label: "Ambiente", value: "Compatível" },
    { label: "Potencial de floração", value: "Alto" },
  ];

  return (
    <Screen>
      <div className="mt-4 animate-fade-up">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-terra">
          Análise completa
        </p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight text-ink">
          Aqui está o seu perfil de orquidófilo
        </h1>
      </div>

      {/* Diagnóstico principal */}
      <div className="mt-6 animate-fade-up rounded-2xl border-2 border-terra/40 bg-gradient-to-b from-terra-faint to-white p-5" style={{ animationDelay: "100ms" }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-terra">Seu diagnóstico</p>
        <p className="mt-1 font-display text-2xl font-semibold text-terra-dark">{d.diagnosis.title}</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink/70">{d.diagnosis.copy}</p>
      </div>

      {/* Alerta */}
      <div className="mt-4 animate-fade-up rounded-2xl border border-[#A6455E]/25 bg-[#A6455E]/10 px-5 py-4" style={{ animationDelay: "200ms" }}>
        <p className="text-[13px] leading-relaxed text-ink/75">
          <strong className="font-semibold text-[#8A3550]">Atenção:</strong> {d.diagnosis.risk}
        </p>
      </div>

      {/* Cards */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {cards.map((c, i) => (
          <div
            key={c.label}
            style={{ animationDelay: `${300 + i * 90}ms` }}
            className={cn(
              "animate-fade-up rounded-2xl border bg-white p-4",
              c.alert ? "border-terra/40 bg-terra-faint" : "border-ink/10"
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/45">{c.label}</p>
            <p className={cn("mt-1 font-display text-[16px] font-semibold leading-tight", c.alert ? "text-terra-dark" : "text-ink")}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <CTA onClick={onNext}>Continuar</CTA>
    </Screen>
  );
}

// ─── Timeline de floração (projeção) ─────────────────────────────────────────

export function BloomTimeline({ d, onNext }: { d: Derived; onNext: () => void }) {
  const milestones = [
    { icon: "📦", title: "Hoje", desc: "Seu kit sai da estufa em embalagem viva segura" },
    { icon: "🌱", title: "Meses 1–6", desc: "Adaptação ao seu ambiente e crescimento das raízes" },
    { icon: "🌿", title: "Meses 7–12", desc: "Folhas novas e primeiras hastes começando a emissão" },
    { icon: "🌸", title: d.bloomLabel, desc: "Primeira floração estimada do seu kit*" },
  ];

  return (
    <Screen>
      <div className="mt-4 animate-fade-up">
        <h1 className="font-display text-[26px] font-semibold leading-tight text-ink">
          O caminho da sua primeira floração
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
          Seguindo o guia do seu perfil, estimamos florações a partir de{" "}
          <strong className="font-semibold text-terra-dark">{d.bloomLabel}</strong>*
        </p>
      </div>

      <div className="relative mt-6 space-y-4">
        <div className="absolute bottom-6 left-[26px] top-6 w-0.5 bg-gradient-to-b from-sage via-terra-light to-terra" />
        {milestones.map((m, i) => (
          <div
            key={m.title}
            style={{ animationDelay: `${i * 150}ms` }}
            className="relative flex animate-fade-up items-start gap-4"
          >
            <span className="z-10 grid size-[52px] shrink-0 place-items-center rounded-full border-2 border-terra/30 bg-white text-2xl shadow-sm">
              {m.icon}
            </span>
            <div className={cn("flex-1 rounded-2xl border bg-white p-4", i === 3 ? "border-terra/50 bg-terra-faint" : "border-ink/10")}>
              <p className={cn("text-[14px] font-bold", i === 3 ? "text-terra-dark" : "text-ink")}>{m.title}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink/60">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[10.5px] leading-relaxed text-ink/40">
        *Estimativa para mudas pré-adultas com os cuidados do guia (rega, luz e substrato corretos).
        Orquídeas são seres vivos: o tempo de floração varia por espécie, clima e dedicação.
      </p>

      <CTA onClick={onNext}>Continuar</CTA>
    </Screen>
  );
}

// ─── Captura de e-mail ───────────────────────────────────────────────────────

export function EmailScreen({ value, onNext }: { value?: string; onNext: (email: string) => void }) {
  const [email, setEmail] = useState(value ?? "");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  return (
    <Screen className="justify-center">
      <div className="animate-fade-up">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-terra-faint text-3xl">
          💌
        </div>
        <h1 className="text-center font-display text-[24px] font-semibold leading-tight text-ink">
          Digite seu e-mail para receber seu{" "}
          <span className="text-terra-dark">Guia do Orquidófilo</span> e reservar seu kit
        </h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
          autoComplete="email"
          className="mt-8 w-full rounded-2xl border border-ink/15 bg-white px-5 py-4 text-center text-[16px] font-medium text-ink outline-none transition focus:border-terra focus:ring-4 focus:ring-terra/15"
        />
        <PrivacyNote>
          Respeitamos sua privacidade e protegemos seus dados pessoais. Seus dados serão processados
          conforme nossa Política de Privacidade.
        </PrivacyNote>
      </div>
      <CTA
        disabled={!valid}
        onClick={() => {
          track("email_submitted");
          onNext(email.trim());
        }}
      >
        Continuar
      </CTA>
    </Screen>
  );
}

// ─── Nome ────────────────────────────────────────────────────────────────────

export function NameScreen({ value, onNext }: { value?: string; onNext: (name: string) => void }) {
  const [name, setName] = useState(value ?? "");
  const valid = name.trim().length >= 2;

  return (
    <Screen className="justify-center">
      <QuestionTitle title="Qual é o seu nome?" sub="Para reservarmos o kit no seu nome e personalizarmos seu guia" />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu primeiro nome"
        autoComplete="given-name"
        className="w-full animate-fade-up rounded-2xl border border-ink/15 bg-white px-5 py-4 text-center font-display text-2xl font-semibold text-ink outline-none transition focus:border-terra focus:ring-4 focus:ring-terra/15"
      />
      <CTA
        disabled={!valid}
        onClick={() => {
          track("name_submitted");
          onNext(name.trim());
        }}
      >
        Continuar
      </CTA>
    </Screen>
  );
}

// ─── Kit reservado ───────────────────────────────────────────────────────────

export function KitReadyScreen({ d, onNext }: { d: Derived; onNext: () => void }) {
  const badges = [
    { icon: "🌸", text: "Mudas selecionadas para o seu ambiente" },
    { icon: "📖", text: "Guia digital personalizado incluso" },
    { icon: "🗓️", text: `Primeira floração estimada: ${d.bloomLabel}*` },
  ];

  return (
    <Screen className="justify-center">
      <div className="animate-fade-up text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sage-dark">
          Festival da Floração de Inverno
        </p>
        <h1 className="mt-2 font-display text-[26px] font-semibold leading-tight text-ink">
          {d.name ? `${d.name}, seu` : "Seu"} Kit da Floração está reservado!
        </h1>
      </div>

      <div className="mt-6 animate-fade-up rounded-2xl border border-ink/10 bg-white p-5 text-center" style={{ animationDelay: "120ms" }}>
        <p className="font-display text-lg font-semibold text-ink">Kit da Floração · Mix Especial</p>
        <p className="mt-1 text-[13px] text-ink/55">
          {d.speciesLabel} — escolhidas pela equipe da estufa conforme o seu quiz
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="rounded-full bg-sage-faint px-3 py-1 text-[11px] font-bold text-sage-dark">
            Pré-adultas
          </span>
          <span className="rounded-full bg-terra-faint px-3 py-1 text-[11px] font-bold text-terra-dark">
            Garantia de chegada viva
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {badges.map((b, i) => (
          <div
            key={i}
            style={{ animationDelay: `${250 + i * 120}ms` }}
            className="flex animate-fade-up items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3.5"
          >
            <span className="text-xl">{b.icon}</span>
            <p className="text-[14px] font-semibold text-ink">{b.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[10.5px] text-ink/40">
        *Estimativa para mudas pré-adultas. O tempo de floração varia por espécie e ambiente.
      </p>

      <CTA onClick={onNext}>Continuar</CTA>
    </Screen>
  );
}

// ─── Raspadinha ──────────────────────────────────────────────────────────────

export function ScratchScreen({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const scratching = useRef(false);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const { width, height } = cv;
    ctx.fillStyle = "#292524";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#FAF7F2";
    ctx.font = "bold 18px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Raspe aqui 🌸", width / 2, height / 2 + 6);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    track("scratch_revealed");
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          onDone();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [revealed, onDone]);

  const scratch = (e: React.PointerEvent) => {
    if (revealed) return;
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const rect = cv.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * cv.width;
    const y = ((e.clientY - rect.top) / rect.height) * cv.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 16 * 4) if (data[i] === 0) clear++;
    if (clear / (data.length / (16 * 4)) > 0.45) setRevealed(true);
  };

  return (
    <Screen className="justify-center">
      <div className="animate-fade-up text-center">
        <h1 className="font-display text-[26px] font-semibold leading-tight text-ink">
          Raspe para revelar seu presente do Festival!
        </h1>
        <p className="mt-2 text-[14px] text-ink/55">
          A estufa preparou uma surpresa para celebrar a safra de inverno com você
        </p>
      </div>

      <div className="relative mx-auto mt-8 w-full max-w-[320px] animate-pop-in overflow-hidden rounded-3xl border-2 border-dashed border-terra/50 shadow-[0_20px_50px_-20px_rgba(162,73,192,0.6)]">
        <div className="flex aspect-[4/3] flex-col items-center justify-center bg-gradient-to-br from-terra-faint to-sage-faint px-6 text-center">
          <p className="font-display text-5xl font-bold text-terra-dark">90%</p>
          <p className="mt-1 text-[15px] font-bold uppercase tracking-wider text-ink">
            de desconto
          </p>
          <p className="mt-1 text-[12.5px] text-ink/60">no seu Kit de Orquídeas</p>
          <div className="mt-3 rounded-full border border-terra/40 bg-white px-4 py-1.5 text-[13px] font-bold tracking-wider text-terra-dark">
            {PROMO_CODE}
          </div>
        </div>
        {!revealed && (
          <canvas
            ref={canvasRef}
            width={320}
            height={240}
            className="scratch-cursor absolute inset-0 size-full touch-none"
            onPointerDown={(e) => {
              scratching.current = true;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              scratch(e);
            }}
            onPointerMove={(e) => scratching.current && scratch(e)}
            onPointerUp={() => (scratching.current = false)}
          />
        )}
      </div>

      {revealed ? (
        <div className="mt-6 animate-fade-up text-center">
          <p className="text-[14px] font-semibold text-sage-dark">
            🎉 Código aplicado automaticamente no checkout
          </p>
          <p className="mt-1 text-[13px] text-ink/50">
            Redirecionando em <strong className="text-ink">{countdown}s</strong>…
          </p>
        </div>
      ) : (
        <p className="mt-6 animate-pulse-soft text-center text-[13px] font-semibold uppercase tracking-widest text-terra">
          ↓ Use o dedo para raspar ↓
        </p>
      )}
    </Screen>
  );
}
