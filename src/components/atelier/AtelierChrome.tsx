import { useEffect, useState, type ReactNode } from "react";
import { MessageCircle, Minus, Plus, RotateCcw, RotateCw } from "lucide-react";
import {
  contact,
  lightPresets,
  product,
  readPrefs,
  related,
  whatsappHref,
  writePrefs,
  type PresetId,
} from "@/lib/catalog";
import { useViewer, zoomLabelRef } from "@/lib/viewer-store";

function useStudioPrefs() {
  const autoRotate = useViewer((s) => s.autoRotate);
  const key = useViewer((s) => s.key);
  const fill = useViewer((s) => s.fill);
  const rim = useViewer((s) => s.rim);
  const temp = useViewer((s) => s.temp);
  const presetId = useViewer((s) => s.presetId);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readPrefs();
    if (saved) useViewer.setState(saved);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      useViewer.setState({ autoRotate: false });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writePrefs({ autoRotate, key, fill, rim, temp, presetId });
  }, [ready, autoRotate, key, fill, rim, temp, presetId]);
}

function useStudioKeys() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "r" || event.key === "R") {
        useViewer.getState().api?.reset();
      } else if (event.key === "+" || event.key === "=") {
        useViewer.getState().api?.zoomBy(0.84);
      } else if (event.key === "-" || event.key === "_") {
        useViewer.getState().api?.zoomBy(1.18);
      } else if (event.code === "Space") {
        event.preventDefault();
        useViewer.getState().toggleAutoRotate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function useAtelierBehavior() {
  useStudioPrefs();
  useStudioKeys();
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-xs font-medium tracking-widest text-muted uppercase">{children}</h2>;
}

function LightSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-0">
      <span className="flex items-baseline justify-between text-xs tracking-widest text-muted uppercase">
        <span>{label}</span>
        <span className="tabular-nums text-ink">{Math.round(value)}</span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        aria-label={label}
        suppressHydrationWarning
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function AtelierHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-paper px-4 md:px-6">
      <div className="flex min-w-0 items-baseline gap-3">
        <p className="shrink-0 text-lg font-medium tracking-tight">{product.brand}</p>
        <p className="truncate text-xs tracking-widest text-muted uppercase">{product.distributor}</p>
      </div>
      <p className="shrink-0 text-xs tracking-widest text-muted uppercase">
        {product.line}
        <span className="hidden text-ink sm:inline"> · {product.kicker}</span>
      </p>
    </header>
  );
}

export function AtelierPanel() {
  const key = useViewer((s) => s.key);
  const fill = useViewer((s) => s.fill);
  const rim = useViewer((s) => s.rim);
  const temp = useViewer((s) => s.temp);
  const presetId = useViewer((s) => s.presetId);
  const setLight = useViewer((s) => s.setLight);
  const applyPreset = useViewer((s) => s.applyPreset);

  return (
    <aside className="border-t border-line bg-paper md:border-t-0 md:border-l">
      <div className="flex flex-col gap-6 px-4 py-5 md:px-6 md:py-7">
        <div className="grid gap-2">
          <p className="text-xs tracking-widest text-muted uppercase">
            {product.series} · {product.category}
          </p>
          <h1 className="text-5xl leading-none font-medium tracking-tight text-balance">{product.name}</h1>
          <p className="text-lg text-palm">{product.kicker}</p>
          <p className="max-w-prose text-sm leading-normal text-pretty text-muted">{product.summary}</p>
        </div>

        <ol className="grid gap-3">
          {product.roles.map((role, index) => (
            <li key={role} className="flex gap-3 text-sm text-ink">
              <span className="font-medium text-palm tabular-nums">0{index + 1}</span>
              <span>{role}</span>
            </li>
          ))}
        </ol>

        <dl className="grid grid-cols-2 gap-3 border-t border-line pt-4">
          <div>
            <dt className="text-xs tracking-widest text-muted uppercase">Tahap</dt>
            <dd className="mt-1 text-sm text-ink">{product.stage}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-widest text-muted uppercase">Area</dt>
            <dd className="mt-1 text-sm text-ink">{product.area}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs tracking-widest text-muted uppercase">Panduan suhu</dt>
            <dd className="mt-1 text-sm text-ink">{product.guide}</dd>
          </div>
        </dl>

        <p className="text-sm leading-normal text-pretty text-muted">{product.note}</p>

        <div className="grid gap-2">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-palm px-4 text-sm font-medium text-paper"
          >
            <MessageCircle className="size-4" strokeWidth={1.75} />
            {contact.label}
          </a>
          <p className="text-xs leading-normal text-muted">
            {product.support} · {product.distributor}
          </p>
        </div>

        <details className="group border-t border-line pt-4">
          <summary className="cursor-pointer text-xs tracking-widest text-muted uppercase">
            Cahaya studio{presetId ? "" : " · custom"}
          </summary>
          <div className="mt-3 grid gap-3">
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Preset cahaya">
              {lightPresets.map((preset) => {
                const active = preset.id === presetId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => applyPreset(preset.id as PresetId)}
                    className={
                      "h-11 rounded-full border text-sm " +
                      (active ? "border-palm bg-palm text-paper" : "border-line bg-paper text-ink")
                    }
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
            <LightSlider label="Utama" value={key} onChange={(value) => setLight({ key: value })} />
            <LightSlider label="Isi" value={fill} onChange={(value) => setLight({ fill: value })} />
            <LightSlider label="Tepi" value={rim} onChange={(value) => setLight({ rim: value })} />
            <LightSlider label="Hangat" value={temp} onChange={(value) => setLight({ temp: value })} />
          </div>
        </details>

        <div className="grid gap-3 border-t border-line pt-4">
          <SectionLabel>Wash formula</SectionLabel>
          <p className="text-sm leading-normal text-pretty text-muted">{product.consult}</p>
          <ol className="grid gap-3">
            {product.steps.map((step) => (
              <li key={step.n} className="grid grid-cols-[2.5rem_1fr] gap-2">
                <p className="font-medium text-palm tabular-nums">{step.n}</p>
                <div>
                  <p className="text-sm text-ink">{step.t}</p>
                  <p className="mt-1 text-sm leading-normal text-muted">{step.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-3">
          <SectionLabel>Lengkapi proses laundry</SectionLabel>
          <ul className="grid grid-cols-2 gap-2">
            {related.map((item) => (
              <li
                key={item.name}
                className={
                  "rounded-2xl border px-3 py-3 " +
                  ("current" in item && item.current ? "border-palm bg-paper" : "border-line")
                }
              >
                <p className="text-xs tracking-widest text-muted uppercase">{item.role}</p>
                <p className="mt-1 text-sm text-ink">{item.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs leading-normal text-muted">
          Seret untuk memutar jeriken. Gulir atau cubit untuk zoom. Ketuk dua kali untuk reset. Tombol: R
          reset, + dan − zoom, spasi memutar meja.
        </p>
      </div>
    </aside>
  );
}

export function StageToolbar() {
  const autoRotate = useViewer((s) => s.autoRotate);
  const toggleAutoRotate = useViewer((s) => s.toggleAutoRotate);
  const ready = useViewer((s) => s.api !== null);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center px-3">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-paper p-1 shadow-sm">
        <ToolbarButton
          label="Perkecil"
          title="Perkecil (−)"
          disabled={!ready}
          onClick={() => useViewer.getState().api?.zoomBy(1.18)}
        >
          <Minus className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <span
          ref={(node) => {
            zoomLabelRef.current = node;
          }}
          className="w-12 text-center text-sm tabular-nums text-ink"
          aria-live="polite"
        >
          100%
        </span>
        <ToolbarButton
          label="Perbesar"
          title="Perbesar (+)"
          disabled={!ready}
          onClick={() => useViewer.getState().api?.zoomBy(0.84)}
        >
          <Plus className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
        <ToolbarButton
          label="Reset kamera"
          title="Reset kamera (R)"
          disabled={!ready}
          onClick={() => useViewer.getState().api?.reset()}
        >
          <RotateCcw className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={autoRotate ? "Hentikan putaran" : "Putar otomatis"}
          title="Putar otomatis (spasi)"
          pressed={autoRotate}
          onClick={toggleAutoRotate}
        >
          <RotateCw className={autoRotate ? "turntable size-4" : "size-4"} strokeWidth={1.75} />
        </ToolbarButton>
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  title,
  onClick,
  children,
  disabled,
  pressed,
}: {
  label: string;
  title: string;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      disabled={disabled}
      aria-pressed={pressed}
      onClick={onClick}
      className={
        "grid size-11 place-items-center rounded-full disabled:opacity-40 " +
        (pressed ? "bg-ink text-paper" : "text-ink")
      }
    >
      {children}
    </button>
  );
}
