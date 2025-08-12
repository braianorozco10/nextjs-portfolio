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
    if (!text || !Array.isArray(targets) || !targets.length) {
      return json({ error: "Missing text/targets" }, 400);
    }

    const q = text.trim();
    // If source is given and not "Auto", map it; otherwise detect
    const sourceCode =
      source && source !== "Auto"
        ? NAME_TO_CODE[source] ?? (await detectSource(q))
        : await detectSource(q);

    // Filter out targets that equal the source to avoid MyMemory error
    const validTargets = targets.filter((name) => {
      const code = NAME_TO_CODE[name];
      return code && code !== sourceCode;
    });

    // If all requested targets equal the source, return empty results gracefully
    if (validTargets.length === 0) {
      return json({ results: Object.fromEntries(targets.map((n) => [n, ""])) });
    }

    // Translate in parallel via MyMemory
    const entries = await Promise.all(
      validTargets.map(async (name) => {
        const target = NAME_TO_CODE[name]!;
        const params = new URLSearchParams({
          q,
          langpair: `${sourceCode}|${target}`,
        });
        if (process.env.MYMEMORY_EMAIL) params.set("de", process.env.MYMEMORY_EMAIL);

        const url = `https://api.mymemory.translated.net/get?${params.toString()}`;
        const r = await fetch(url, { headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error(`MyMemory ${r.status}: ${await r.text().catch(()=>"<no body>")}`);
        const data = await r.json();
        const translated = data?.responseData?.translatedText ?? "";
        return [name, translated] as const;
      })
    );

    // Include empty strings for skipped (source==target) so UI stays aligned
    const results: Record<string, string> = Object.fromEntries(entries);
    targets.forEach((name) => {
      if (!(name in results)) results[name] = ""; // skipped ones
    });

    return json({ results, meta: { detectedSource: sourceCode } });
  } catch (e: any) {
    console.error("API /translate error:", e);
    return json({ error: e?.message ?? "Server error" }, 500);
  }
}

async function detectSource(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/detect?q=${encodeURIComponent(text)}`;
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error(`Detect ${r.status}`);
    const data = await r.json();
    const detected =
      data?.data?.language ||
      data?.responseData?.language ||
      data?.language ||
      data?.matches?.[0]?.language;
    if (typeof detected === "string" && detected.length >= 2) return detected.toLowerCase();
    return "en"; // fallback
  } catch {
    return "en";
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
