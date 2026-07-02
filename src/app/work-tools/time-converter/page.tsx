'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Download, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';

type Box = {
  id: string;
  name: string;
  raw: string;
  lunch: number[]; // line indices with lunch +1h
  forced: number[]; // line indices forced to 8h
};

type Line = { input: string; base: number };

function makeBox(): Box {
  return { id: crypto.randomUUID(), name: '', raw: '', lunch: [], forced: [] };
}

/** Parse pasted text into one entry per line. Accepts "8h 5m", "1h 30", "0h 0m". */
function parseLines(raw: string): Line[] {
  return raw
    .split('\n')
    .map(line => {
      const match = line.match(/(\d+)\s*h\s*(\d+)?\s*m?/i);
      if (!match) return null;
      const hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      return { input: line.trim(), base: hours + minutes / 60 };
    })
    .filter((l): l is Line => l != null);
}

/** Decimal for a single line after lunch / force-8h adjustments. */
function decimalFor(base: number, lunch: boolean, forced: boolean): number {
  const raw = forced ? 8 : lunch ? base + 1 : base;
  return parseFloat(raw.toFixed(2));
}

function toggleIndex(list: number[], i: number): number[] {
  return list.includes(i) ? list.filter(x => x !== i) : [...list, i];
}

export default function TimeConverterPage() {
  const [boxes, setBoxes] = useState<Box[]>([makeBox()]);

  const parsed = useMemo(
    () => boxes.map(b => ({ box: b, lines: parseLines(b.raw) })),
    [boxes]
  );

  const totalRows = parsed.filter(p => p.lines.length > 0).length;

  function update(id: string, patch: Partial<Box>) {
    setBoxes(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
  }

  function addBox() {
    setBoxes(prev => [...prev, makeBox()]);
  }

  function removeBox(id: string) {
    setBoxes(prev => (prev.length > 1 ? prev.filter(b => b.id !== id) : prev));
  }

  function downloadReport() {
    const populated = parsed.filter(p => p.lines.length > 0);
    if (!populated.length) return;

    const maxLen = Math.max(...populated.map(p => p.lines.length));
    const header = ['Name', ...Array.from({ length: maxLen }, (_, i) => i + 1)];

    const data = [
      header,
      ...populated.map(({ box }, i) => {
        const lines = parseLines(box.raw);
        const decimals = lines.map((l, li) =>
          decimalFor(l.base, box.lunch.includes(li), box.forced.includes(li))
        );
        return [box.name.trim() || `Entry ${i + 1}`, ...decimals];
      }),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 24 }, ...Array(maxLen).fill({ wch: 8 })];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Converted Times');
    XLSX.writeFile(wb, 'Converted_Times.xlsx');
  }

  return (
    <main className="min-h-screen bg-[#f9fafb] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600/10 text-indigo-600">
              <Clock className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-[#1f2937]">Time Converter</h1>
              <p className="text-sm text-gray-500">
                Paste a column of times into a box (e.g.{' '}
                <span className="font-medium text-gray-600">8h 5m</span>). Each box
                becomes one named row in the sheet.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {parsed.map(({ box, lines }, boxIdx) => (
              <motion.div
                key={box.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="hidden h-7 w-7 shrink-0 place-items-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500 sm:grid">
                    {boxIdx + 1}
                  </span>
                  <input
                    value={box.name}
                    onChange={e => update(box.id, { name: e.target.value })}
                    placeholder="Name for this row"
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <span className="shrink-0 text-xs text-gray-400">
                    {lines.length} {lines.length === 1 ? 'entry' : 'entries'}
                  </span>
                  <button
                    onClick={() => removeBox(box.id)}
                    disabled={boxes.length === 1}
                    aria-label="Remove box"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-gray-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <textarea
                    value={box.raw}
                    onChange={e => update(box.id, { raw: e.target.value })}
                    placeholder={'Paste times here, one per line:\n8h 5m\n13h 26m\n0h 0m'}
                    className="h-56 w-full resize-y rounded-xl border border-gray-200 p-3 font-mono text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  />

                  <div className="h-56 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/60">
                    {lines.length === 0 ? (
                      <div className="grid h-full place-items-center text-sm text-gray-300">
                        Converted decimals appear here
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">#</th>
                            <th className="px-3 py-2 text-left font-medium">Input</th>
                            <th className="px-3 py-2 text-right font-medium">Decimal</th>
                            <th className="px-2 py-2 text-center font-medium">Lun</th>
                            <th className="px-2 py-2 text-center font-medium">8h</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lines.map((l, li) => {
                            const lunch = box.lunch.includes(li);
                            const forced = box.forced.includes(li);
                            const dec = decimalFor(l.base, lunch, forced);
                            return (
                              <tr
                                key={li}
                                className="border-t border-gray-100 hover:bg-white"
                              >
                                <td className="px-3 py-1.5 text-gray-400">{li + 1}</td>
                                <td className="px-3 py-1.5 font-mono text-gray-600">
                                  {l.input}
                                </td>
                                <td className="px-3 py-1.5 text-right font-semibold tabular-nums text-indigo-700">
                                  {dec.toFixed(2)}
                                </td>
                                <td className="px-2 py-1.5 text-center">
                                  <input
                                    type="checkbox"
                                    checked={lunch}
                                    disabled={forced}
                                    onChange={() =>
                                      update(box.id, {
                                        lunch: toggleIndex(box.lunch, li),
                                      })
                                    }
                                    className="accent-indigo-600"
                                  />
                                </td>
                                <td className="px-2 py-1.5 text-center">
                                  <input
                                    type="checkbox"
                                    checked={forced}
                                    onChange={() =>
                                      update(box.id, {
                                        forced: toggleIndex(box.forced, li),
                                      })
                                    }
                                    className="accent-indigo-600"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          onClick={addBox}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition hover:border-indigo-400 hover:text-indigo-600"
        >
          <Plus className="h-4 w-4" />
          Add input box
        </button>

        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{totalRows}</span>{' '}
            {totalRows === 1 ? 'row' : 'rows'} ready to export
          </p>
          <button
            onClick={downloadReport}
            disabled={totalRows === 0}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Download sheet
          </button>
        </div>
      </div>
    </main>
  );
}
