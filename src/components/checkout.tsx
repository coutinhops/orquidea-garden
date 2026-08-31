import { useEffect, useState } from "react";
import { Check, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND, PROMO_CODE, track } from "@/lib/funnel";
import type { Derived } from "@/lib/funnel";
import { Stars, useCountdown } from "./bits";
import { IMG } from "@/lib/images";

const kitImg = IMG.kit10;
const logo = IMG.logo;

// ─── Kits ────────────────────────────────────────────────────────────────────

interface Kit {
  id: string;
  name: string;
  units: number;
  from: string;
  price: number;
  priceLabel: string;
  installments: string;
  perUnit: string;
  url: string;
  popular?: boolean;
}

const KITS: Kit[] = [
  { id: "5", name: "Kit 5 Mudas · Iniciante", units: 5, from: "R$ 299,90", price: 29.9, priceLabel: "R$ 29,90", installments: "5x de R$ 5,98", perUnit: "R$ 5,98/muda", url: "https://pay.compra-orquidea.site/P5LNZ8DbvnVZaRy" },
  { id: "10", name: "Kit 10 Mudas · Mix Especial", units: 10, from: "R$ 499,90", price: 49.9, priceLabel: "R$ 49,90", installments: "5x de R$ 9,98", perUnit: "R$ 4,99/muda", url: "https://pay.compra-orquidea.site/521rZJz0vdeZeaX", popular: true },
  { id: "20", name: "Kit 20 Mudas · Estufa Completa", units: 20, from: "R$ 899,90", price: 89.9, priceLabel: "R$ 89,90", installments: "5x de R$ 17,98", perUnit: "R$ 4,50/muda", url: "https://pay.compra-orquidea.site/nWrxGWan7Dz3654" },
];

function goCheckout(kit: Kit) {
  track("purchase_click", { kit: kit.id });
  window.location.href = kit.url;
}

function KitCards({ selected, onSelect }: { selected: Kit; onSelect: (k: Kit) => void }) {
  return (
    <div className="space-y-3">
      {KITS.map((k) => (
        <button
          key={k.id}
          onClick={() => {
            track("plan_selected", { id: k.id });
            onSelect(k);
          }}
          className={cn(
            "relative w-full rounded-2xl border-2 bg-white p-4 text-left transition-all",
            selected.id === k.id
              ? "border-terra shadow-[0_10px_30px_-12px_rgba(162,73,192,0.55)]"
              : "border-ink/10 hover:border-terra/40"
          )}
        >
          {k.popular && (
            <span className="absolute -top-3 left-4 rounded-full bg-terra px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Mais popular
            </span>
          )}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border-2",
                selected.id === k.id ? "border-terra bg-terra" : "border-ink/20"
              )}
            >
              {selected.id === k.id && <Check className="size-3.5 text-white" strokeWidth={3.5} />}
            </span>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-ink">{k.name}</p>
              <p className="text-[12.5px] text-ink/50">
                <s>{k.from}</s>{" "}
                <span className="font-bold text-terra-dark">{k.priceLabel}</span>
                <span className="text-ink/40"> · {k.installments}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-semibold leading-tight text-ink">{k.perUnit.split("/")[0]}</p>
              <p className="text-[11px] font-semibold uppercase text-ink/45">por muda</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Conteúdo ────────────────────────────────────────────────────────────────

const INCLUDED = [
  { icon: "🌱", title: "Mudas pré-adultas selecionadas", desc: "escolhidas pela estufa conforme o seu perfil e ambiente" },
  { icon: "📖", title: "Guia digital do seu perfil", desc: "rega, luz, substrato e adubação no ponto certo para você" },
  { icon: "📦", title: "Embalagem viva segura", desc: "mudas protegidas e hidratadas para viajar sem estresse" },
  { icon: "🛡️", title: "Garantia de chegada viva", desc: "chegou com problema? Repomos sem custo" },
  { icon: "🗓️", title: "Calendário de rega por espécie", desc: "o fim do excesso de água — a causa nº 1 de perdas" },
  { icon: "💬", title: "Comunidade de orquidófilos", desc: "grupo de apoio com especialistas da estufa" },
];

const STORIES = [
  {
    name: "Cleusa, 61 anos",
    result: "12 florações/ano",
    text: "Matei 4 orquídeas antes de entender que rega demais era o problema. Com o calendário do kit, minhas phalaenopsis florescem duas vezes por ano — e a vizinhança inteira pergunta o segredo.",
  },
  {
    name: "Nelson, 58 anos",
    result: "27 vasos na varanda",
    text: "Comecei com o kit de 10 sem saber nada. Dois anos depois, minha varanda tem 27 vasos e o carteiro já entrega encomenda perguntando das 'meninas'. Melhor hobby da aposentadoria.",
  },
  {
    name: "Márcia, 47 anos",
    result: "Tradição de domingo",
    text: "Comprei o kit para presentear minha mãe de 70 anos. Hoje cuidamos juntas das orquídeas todo domingo — virou nosso programa e o assunto que não acaba mais.",
  },
];

const FAQS = [
  {
    q: "As orquídeas chegam floridas?",
    a: "Não — e isso é proposital. O kit traz mudas pré-adultas selecionadas, que crescem já adaptadas ao SEU ambiente. Plantas adultas floridas de floricultura quase sempre perdem as flores e definham na troca de ambiente. Com os cuidados do guia, a primeira floração acontece em média entre 12 e 24 meses — e dura muito mais anos.",
  },
  {
    q: "Nunca cuidei de orquídeas. Vou conseguir?",
    a: "Sim. O kit foi desenhado para iniciantes: as variedades são resistentes, o guia digital explica rega, luz e substrato sem técnica demais, e o calendário de rega elimina o erro que mais mata orquídeas. E a comunidade tira dúvidas todos os dias.",
  },
  {
    q: "Como funciona o frete e a garantia?",
    a: "O frete é calculado no checkout conforme seu CEP, com envio para todo o Brasil em embalagem viva segura. Se alguma muda chegar danificada ou não sobreviver à viagem, repomos sem custo — basta nos avisar em até 7 dias com foto.",
  },
  {
    q: "Por que o desconto de 90%?",
    a: "É o Festival da Floração de Inverno: celebramos a safra de inverno da estufa e liberamos o lote final de mudas da temporada com 90% OFF. Quando o lote acaba, o preço volta ao normal.",
  },
];

export function Checkout({ d }: { d: Derived }) {
  const countdown = useCountdown(9);
  const [kit, setKit] = useState<Kit>(KITS[1]);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    track("checkout_opened");
    window.scrollTo(0, 0);
  }, []);

  const firstName = d.name || "";

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-cream pb-16 min-h-dvh sm:border-x sm:border-ink/5 sm:shadow-[0_0_80px_-24px_rgba(28,25,23,0.35)]">
      {/* Header fixo */}
      <header
        className="sticky top-0 z-30 border-b border-ink/10 bg-cream/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
          <img src={logo} alt={BRAND} decoding="async" className="h-11 w-auto" />
          <div className="flex items-center gap-2 rounded-full bg-[#A6455E]/10 px-3 py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#A6455E] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[#A6455E]" />
            </span>
            <p className="text-[12px] font-bold text-[#8A3550]">
              90% OFF reservado: {countdown}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5">
        {/* J1 — Hero */}
        <section className="pt-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sage-dark">
            Festival da Floração de Inverno
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink">
            {firstName ? `${firstName}, seu` : "Seu"} Kit da Floração está pronto!
          </h1>
          <div className="mt-6 overflow-hidden rounded-3xl border border-ink/10 bg-white">
            <img src={kitImg} alt="Kit com mudas de orquídeas" loading="lazy" decoding="async" className="w-full object-cover" />
            <div className="space-y-3 p-6 text-left">
              {[
                ["Sua coleção", "0–3 vasos", "Mudas selecionadas"],
                ["Floração", "Incerta", "Guiada pelo método"],
                ["Cuidado", "Tentativa e erro", "Calendário por espécie"],
              ].map(([label, from, to]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between gap-2 text-[12px] font-semibold">
                    <span className="shrink-0 text-ink/60">{label}</span>
                    <span className="text-right">
                      <span className="text-ink/40">{from}</span>
                      <span className="mx-1.5 text-terra">→</span>
                      <span className="text-sage-dark">{to}</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-terra to-sage" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink/40">
            Foto real das mudas do kit, direto da estufa. As mudas são pré-adultas: a primeira
            floração acontece em média entre 12 e 24 meses com os cuidados do guia.
          </p>
        </section>

        {/* J2 — Oferta */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-center gap-2 rounded-full border border-sage/30 bg-sage-faint px-4 py-2">
            <Check className="size-4 text-sage-dark" strokeWidth={3} />
            <p className="text-[12.5px] font-bold text-sage-dark">
              Cupom do Festival aplicado: <span className="tracking-wider">{PROMO_CODE}</span>
            </p>
          </div>
          <h2 className="mb-4 text-center font-display text-2xl font-semibold text-ink">
            Escolha o seu kit
          </h2>
          <KitCards selected={kit} onSelect={setKit} />
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-ink/55">
            <Truck className="size-4 text-sage" />
            Envio para todo o Brasil · frete calculado no checkout
          </p>
          <button
            onClick={() => goCheckout(kit)}
            className="mt-4 w-full rounded-full bg-cta py-4 text-[15px] font-bold uppercase tracking-[0.12em] text-cream transition hover:bg-ink active:scale-[0.98]"
          >
            Quero meu kit com 90% OFF
          </button>
        </section>

        {/* J3 — Selos */}
        <section className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {["SSL Seguro", "Visa", "Mastercard", "PCI", "Pix", "Boleto"].map((s) => (
            <span
              key={s}
              className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-bold text-ink/55"
            >
              <ShieldCheck className="size-3.5 text-sage" />
              {s}
            </span>
          ))}
        </section>

        {/* J4 — O que inclui */}
        <section className="mt-12">
          <h2 className="text-center font-display text-2xl font-semibold text-ink">
            O que está incluído no seu kit
          </h2>
          <div className="mt-5 space-y-3">
            {INCLUDED.map((b, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-terra-faint text-xl">
                  {b.icon}
                </span>
                <div>
                  <p className="text-[15px] font-bold text-ink">{b.title}</p>
                  <p className="text-[13px] text-ink/55">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* J5 — Avaliações */}
        <section className="mt-10 rounded-3xl border border-ink/10 bg-white p-6 text-center">
          <Stars n={5} className="justify-center" />
          <p className="mt-3 font-display text-xl font-semibold text-ink">
            4,8 de 5 · mais de 31 mil avaliações
          </p>
          <p className="mt-1 text-[13px] text-ink/50">
            Loja verificada · 180 mil+ mudas enviadas com garantia de chegada viva
          </p>
        </section>

        {/* J6 — Histórias */}
        <section className="mt-12">
          <h2 className="text-center font-display text-2xl font-semibold text-ink">
            Varandas que florescem
          </h2>
          <div className="mt-5 space-y-4">
            {STORIES.map((s) => (
              <article key={s.name} className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14.5px] font-bold text-ink">{s.name}</p>
                      <Stars n={5} />
                    </div>
                    <span className="rounded-full bg-sage-faint px-3 py-1.5 text-[13px] font-bold text-sage-dark">
                      {s.result}
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink/70">“{s.text}”</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-3 text-[10.5px] leading-relaxed text-ink/40">
            Depoimentos de clientes com resultados individuais; o tempo e a quantidade de florações
            variam conforme espécie, ambiente e dedicação.
          </p>
        </section>

        {/* J7 — FAQ */}
        <section className="mt-12">
          <h2 className="text-center font-display text-2xl font-semibold text-ink">
            Perguntas frequentes
          </h2>
          <div className="mt-5 space-y-2.5">
            {FAQS.map((f, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-[14.5px] font-bold text-ink">{f.q}</span>
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full bg-terra-faint text-terra-dark transition-transform",
                      faqOpen === i && "rotate-45"
                    )}
                  >
                    +
                  </span>
                </button>
                {faqOpen === i && (
                  <p className="animate-fade-up px-5 pb-4 text-[13.5px] leading-relaxed text-ink/65">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* J8 — Mídia */}
        <section className="mt-12 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink/40">
            Falam sobre cultivo de orquídeas em
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 opacity-50">
            {["Casa e Jardim", "Globo Rural", "Revista Natureza", "Viva Decora"].map((m) => (
              <span key={m} className="font-display text-[15px] font-semibold text-ink">
                {m}
              </span>
            ))}
          </div>
        </section>

        {/* J9 — Prova social */}
        <section className="mt-12 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Mais de 212 mil orquidófilos na comunidade
          </h2>
          <div className="mt-5 space-y-3">
            {[
              ["Iolanda P.", "As mudas chegaram perfeitas, raízes verdinhas. 14 meses depois: primeira haste floral. Chorei."],
              ["Roberto A.", "O calendário de rega sozinho já vale o kit. Nunca mais perdi planta por excesso de água."],
              ["Teresa M.", "Comprei no festival achando que era exagero. Era tudo verdade: guia completo e suporte que responde."],
            ].map(([n, t]) => (
              <div key={n} className="rounded-2xl border border-ink/10 bg-white p-4 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-[13.5px] font-bold text-ink">{n}</p>
                  <Stars n={5} />
                </div>
                <p className="mt-1.5 text-[13px] text-ink/65">“{t}”</p>
              </div>
            ))}
          </div>
        </section>

        {/* J10 — Repetição da oferta */}
        <section className="mt-12">
          <h2 className="mb-1 text-center font-display text-2xl font-semibold text-ink">
            Últimas mudas da safra de inverno!
          </h2>
          <p className="mb-4 text-center text-[13px] font-semibold text-[#8A3550]">
            Seu 90% OFF expira em {countdown}
          </p>
          <KitCards selected={kit} onSelect={setKit} />
          <button
            onClick={() => goCheckout(kit)}
            className="mt-4 w-full rounded-full bg-terra py-4 text-[15px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-terra-dark active:scale-[0.98]"
          >
            Quero meu kit com 90% OFF
          </button>
        </section>

        {/* J11 — Garantia */}
        <section className="mt-10 rounded-3xl border border-sage/30 bg-sage-faint p-6 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-sage text-white">
            <ShieldCheck className="size-6" />
          </span>
          <h3 className="mt-3 font-display text-xl font-semibold text-ink">
            Garantia de chegada viva + 7 dias
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink/65">
            Se alguma muda chegar danificada ou não sobreviver à viagem, repomos sem custo. E se em
            7 dias você entender que o kit não é para você, devolvemos seu dinheiro conforme o
            Código de Defesa do Consumidor.
          </p>
        </section>

        {/* J12 — Footer */}
        <footer className="mt-12 border-t border-ink/10 pt-6 text-center text-[11px] leading-relaxed text-ink/40">
          <p className="font-semibold text-ink/55">{BRAND} · CNPJ 00.000.000/0001-00</p>
          <p className="mt-1">Holambra, SP — Brasil</p>
          <p className="mt-3">
            <span className="underline">Política de Privacidade</span> ·{" "}
            <span className="underline">Termos de Serviço</span> ·{" "}
            <span className="underline">Trocas e Devoluções</span>
          </p>
          <p className="mt-3">
            As fotos de orquídeas floridas ilustram o potencial das espécies adultas. O kit contém
            mudas pré-adultas; a primeira floração ocorre em média entre 12 e 24 meses com os
            cuidados recomendados.
          </p>
        </footer>
      </main>
    </div>
  );
}
