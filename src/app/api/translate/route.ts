// src/app/api/translate/route.ts
export const runtime = "nodejs";

type Body = { text: string; targets: string[]; source?: string }; // "source" is UI name or "Auto"

const NAME_TO_CODE: Record<string, string> = {
  "Inglés": "en",
  "Español": "es",
  "Francés": "fr",
  "Alemán": "de",
  "Italiano": "it",
  "Portugués": "pt",
  "Japonés": "ja",
  "Coreano": "ko",
  "Chino (Mandarín)": "zh",
  "Árabe": "ar",
  "Ruso": "ru",
};

export async function POST(req: Request) {
  try {
    const { text, targets, source } = (await req.json()) as Body;

    if (!text || !Array.isArray(targets) || targets.length === 0) {
      return json({ error: "Missing text/targets" }, 400);
    }

    const q = text.trim();
    const srcCode =
      source && source !== "Auto"
        ? NAME_TO_CODE[source] ?? (await detectSource(q))
        : await detectSource(q);

    // skip targets that are the same as the source (avoids MyMemory error)
    const validTargets = targets.filter((name) => {
      const code = NAME_TO_CODE[name];
      return Boolean(code && code !== srcCode);
    });

    if (validTargets.length === 0) {
      // nothing to translate; return empty strings for all requested targets
      return json({ results: Object.fromEntries(targets.map((n) => [n, ""])) });
    }

    const entries = await Promise.all(
      validTargets.map(async (name) => {
        const target = NAME_TO_CODE[name]!;
        const params = new URLSearchParams({
          q,
          langpair: `${srcCode}|${target}`,
        });
        if (process.env.MYMEMORY_EMAIL) params.set("de", process.env.MYMEMORY_EMAIL);

        const url = `https://api.mymemory.translated.net/get?${params.toString()}`;
        const r = await fetch(url, { headers: { Accept: "application/json" } });
        if (!r.ok) {
          const body = await r.text().catch(() => "<no body>");
          throw new Error(`MyMemory ${r.status}: ${body}`);
        }
        const data = (await r.json()) as unknown;
        const translated = readTranslatedText(data);
        return [name, translated] as const;
      })
    );

    // include empty strings for skipped (source==target) to keep UI aligned
    const results: Record<string, string> = Object.fromEntries(entries);
    targets.forEach((name) => {
      if (!(name in results)) results[name] = "";
    });

    return json({ results, meta: { detectedSource: srcCode } });
  } catch (e: unknown) {
    console.error("API /translate error:", errorMessage(e));
    return json({ error: errorMessage(e) }, 500);
  }
}

async function detectSource(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/detect?q=${encodeURIComponent(text)}`;
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error(`Detect ${r.status}`);
    const data = (await r.json()) as unknown;

    const lang =
      // various shapes MyMemory has been seen to return
      (data as { data?: { language?: string } }).data?.language ??
      (data as { responseData?: { language?: string } }).responseData?.language ??
      (data as { language?: string }).language ??
      (data as { matches?: Array<{ language?: string }> }).matches?.[0]?.language;

    return typeof lang === "string" && lang.length >= 2 ? lang.toLowerCase() : "en";
  } catch {
    return "en";
  }
}

function readTranslatedText(data: unknown): string {
  const txt =
    (data as { responseData?: { translatedText?: string } }).responseData?.translatedText ??
    "";
  return typeof txt === "string" ? txt : "";
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
