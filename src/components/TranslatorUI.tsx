// components/TranslatorUI.tsx
import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import { Globe2, ChevronDown, X, Copy, Trash2, Loader2, Sun, Moon } from "lucide-react";

// Idiomas visibles en la UI
const LANGUAGES = [
  "Inglés",
  "Español",
  "Francés",
  "Alemán",
  "Italiano",
  "Portugués",
  "Japonés",
  "Coreano",
  "Chino (Mandarín)",
  "Árabe",
  "Ruso",
] as const;

type Language = typeof LANGUAGES[number];
type ResultsMap = Partial<Record<Language, string>>;
const SOURCE_OPTIONS = ["Auto", ...LANGUAGES] as const;
type SourceOption = typeof SOURCE_OPTIONS[number];


export default function TranslatorUI(): JSX.Element {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Language[]>(["Inglés"]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [results, setResults] = useState<ResultsMap>({});
  const [light, setLight] = useState(false);
  const [source, setSource] = useState<SourceOption>("Auto");
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const charCount = input.length;

  const toggleLanguage = (lang: Language) =>
    setSelected((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]));

  const clearAll = () => {
    setInput("");
    setResults({});
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  // === Traducción a través de API interna /api/translate (recomendado) ===
const handleTranslate = async () => {
  if (!input || !selected.length) return;
  setIsTranslating(true);
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, targets: selected, source }), // <-- include source
    });

    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { results: ResultsMap };
    setResults(data.results);
  } catch (err) {
    console.error(err);
    alert("No se pudo traducir. Intenta de nuevo más tarde.");
  } finally {
    setIsTranslating(false);
  }
};


  // Tema light/dark
  const theme = useMemo(
    () => ({
      bgMain: light ? "bg-[#f7f8fb] text-[#0b0d10]" : "bg-[#0b0d10] text-[#e5e7eb]",
      card: light ? "bg-white border-black/10" : "bg-[#0f1216] border-white/10",
      soft: light ? "bg-black/5 border-black/10" : "bg-white/5 border-white/10",
      softHover: light ? "hover:bg-black/10" : "hover:bg-white/10",
      subtext: light ? "text-black/60" : "text-white/70",
      subtextMuted: light ? "text-black/40" : "text-white/50",
      ring: "focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60",
    }),
    [light]
  );

  return (
    <main className={`min-h-screen ${theme.bgMain} flex items-center justify-center p-6 relative`}>
      {/* Switch Light/Dark */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setLight(!light)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border ${theme.soft} ${theme.softHover}`}
          aria-label="Alternar tema"
        >
          {light ? <Sun size={16} /> : <Moon size={16} />}
          <span className="text-xs font-medium">{light ? "Light" : "Dark"}</span>
        </button>
      </div>

      <div className="w-full max-w-6xl grid gap-6 md:grid-cols-[1.1fr_1.3fr]">
        {/* Panel izquierdo */}
        <section className={`${theme.card} rounded-2xl shadow-2xl p-5 md:p-6`}>
          <header className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${theme.soft}`}>
              <Globe2 size={18} />
            </div>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight">Traductor</h1>
          </header>

          <div className="flex items-center gap-2">
            <label className={`text-sm ${theme.subtext}`}>Idioma origen</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as SourceOption)}
              className={`text-sm rounded-xl px-3 py-2 border ${theme.soft} ${theme.softHover} outline-none ${theme.ring}`}
              title="Idioma de origen"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <label className={`block text-sm ${theme.subtext} mb-2`}>Texto a traducir</label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe o pega tu texto aquí…"
              className={`w-full h-48 md:h-64 resize-none rounded-2xl ${theme.soft} outline-none ${theme.ring} p-4`}
            />
            <div className={`absolute bottom-3 right-3 text-xs ${theme.subtextMuted}`}>{charCount} caracteres</div>
          </div>

          {/* Controles */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            {/* Dropdown multi-selección */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${theme.soft} ${theme.softHover}`}
              >
                <ChevronDown size={16} />
                <span className="text-sm">Seleccionar idiomas</span>
              </button>
              {open && (
                <div className={`absolute z-20 mt-2 w-64 rounded-xl ${theme.card} shadow-xl p-2 max-h-72 overflow-auto`}>
                  {LANGUAGES.map((lang) => {
                    const active = selected.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${active ? (light ? "bg-black/5" : "bg-white/5") : ""} ${theme.softHover}`}
                      >
                        <span>{lang}</span>
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${active ? "bg-indigo-500" : light ? "bg-black/15" : "bg-white/15"}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border ${theme.soft} ${theme.softHover}`}
              >
                <Trash2 size={16} /> Limpiar
              </button>
              <button
                onClick={handleTranslate}
                disabled={!input || !selected.length || isTranslating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40"
              >
                {isTranslating ? <Loader2 className="animate-spin" size={16} /> : <Globe2 size={16} />}
                Traducir
              </button>
            </div>
          </div>

          {/* Chips de idiomas seleccionados */}
          {selected.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.map((lang) => (
                <span key={lang} className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs ${theme.soft} border`}>
                  {lang}
                  <button onClick={() => toggleLanguage(lang)} className="hover:opacity-80" title="Quitar">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Panel derecho: resultados */}
        <section className={`${theme.card} rounded-2xl shadow-2xl p-5 md:p-6`}>
          <header className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold tracking-tight">Traducciones</h2>
            <span className={`text-xs ${theme.subtextMuted}`}>{selected.length} idioma(s)</span>
          </header>

          {selected.length === 0 ? (
            <EmptyState light={light} />
          ) : (
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {selected.map((lang) => (
                <ResultCard
                  key={lang}
                  language={lang}
                  text={results[lang] ?? ""}
                  onCopy={() => copyText(results[lang] ?? "")}
                  light={light}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

type ResultCardProps = { language: Language; text: string; onCopy: () => void; light: boolean };
function ResultCard({ language, text, onCopy, light }: ResultCardProps) {
  return (
    <div className={`rounded-2xl border p-3 md:p-4 flex flex-col min-h-[160px] ${light ? "bg-black/3 border-black/10" : "bg-white/3 border-white/10 backdrop-blur-sm"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${light ? "text-black/80" : "text-white/80"}`}>{language}</span>
        <button
          onClick={onCopy}
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${light ? "bg-black/5 border-black/10 hover:bg-black/10" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
        >
          <Copy size={14} /> Copiar
        </button>
      </div>
      <div className="flex-1">
        {text ? (
          <p className={`text-sm whitespace-pre-wrap ${light ? "text-black/85" : "text-white/85"}`}>{text}</p>
        ) : (
          <p className={`text-sm italic ${light ? "text-black/40" : "text-white/40"}`}>Presiona "Traducir"…</p>
        )}
      </div>
    </div>
  );
}

type EmptyStateProps = { light?: boolean };
function EmptyState({ light = false }: EmptyStateProps) {
  return (
    <div className={`h-[300px] md:h-[420px] rounded-2xl border border-dashed flex items-center justify-center text-center p-8 ${light ? "border-black/15" : "border-white/15"}`}>
      <div className="max-w-sm">
        <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${light ? "bg-black/5 border border-black/10" : "bg-white/5 border border-white/10"}`}>
          <Globe2 size={18} />
        </div>
        <p className={`${light ? "text-black/70" : "text-white/70"} text-sm`}>
          Selecciona uno o más idiomas y escribe tu texto para ver aquí las traducciones.
        </p>
      </div>
    </div>
  );
}
