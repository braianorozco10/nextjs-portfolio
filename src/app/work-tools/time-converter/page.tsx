'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

type Row = {
  index: number;
  time: number;
  originalTime: number;
  lunch: boolean;
  forced8h: boolean;
};

export default function TimeConverterPage() {
  const [input, setInput] = useState<string>('');
  const [rows, setRows] = useState<Row[]>([]);

  function convertTimes() {
    const lines = input.split('\n');
    const next: Row[] = [];
    lines.forEach((line, idx) => {
      const match = line.match(/(\d+)h\s+(\d+)m/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const decimalTime = hours + minutes / 60;
        const val = parseFloat(decimalTime.toFixed(2));
        next.push({
          index: idx + 1,
          time: val,
          originalTime: val,
          lunch: false,
          forced8h: false,
        });
      }
    });
    setRows(next);
  }

  function toggleLunch(i: number) {
    setRows(prev =>
      prev.map((r, idx) => {
        if (idx !== i) return r;
        if (r.forced8h) return r;
        const lunch = !r.lunch;
        const time = lunch ? r.time + 1 : r.time - 1;
        return { ...r, lunch, time: parseFloat(time.toFixed(2)) };
      })
    );
  }

  function forceEight(i: number) {
    setRows(prev =>
      prev.map((r, idx) => {
        if (idx !== i) return r;
        return r.forced8h
          ? { ...r, forced8h: false, time: r.originalTime }
          : { ...r, forced8h: true, time: 8.0 };
      })
    );
  }

  function downloadReport() {
    if (!rows.length) return;
    const data = [
      ['#', ...rows.map(r => r.index)],
      ['Time (Decimal)', ...rows.map(r => r.time)],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Converted Times');
    XLSX.writeFile(wb, 'Converted_Times.xlsx');
  }

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold mb-4">Time Converter</h1>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="One per line: e.g. 7h 30m"
          className="w-full h-40 rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={convertTimes}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700"
          >
            Convert
          </button>
          <button
            onClick={downloadReport}
            className="rounded-xl border border-gray-300 px-4 py-2 font-medium bg-white hover:bg-gray-50"
          >
            Download Report
          </button>
        </div>

        {!!rows.length && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">#</th>
                  <th className="border p-2 text-left">Time (Decimal)</th>
                  <th className="border p-2 text-left">Lunch +1h</th>
                  <th className="border p-2 text-left">Force 8h</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="border p-2">{r.index}</td>
                    <td className="border p-2">{r.time.toFixed(2)}</td>
                    <td className="border p-2">
                      <input
                        type="checkbox"
                        checked={r.lunch}
                        onChange={() => toggleLunch(i)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="checkbox"
                        checked={r.forced8h}
                        onChange={() => forceEight(i)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}