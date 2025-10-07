import React from 'react';

type SidebarProps = {
  year: number;
  month: number;
  setYear: (y: number) => void;
  setMonth: (m: number) => void;
};

export default function Sidebar({ year, month, setYear, setMonth }: SidebarProps) {
  const currentYear = new Date().getFullYear();
  return (
    <aside className="w-72 bg-biznet-900 text-white min-h-screen p-4">
      <div className="text-xl font-bold mb-6">Biznet Campang Raya</div>
      <div className="mb-4">
        <label className="text-sm">Tahun</label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full mt-2 p-2 rounded text-black"
        >
          {Array.from({ length: 4 }).map((_, i) => {
            const y = currentYear - 2 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>
      <div className="mb-4">
        <label className="text-sm">Bulan</label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="w-full mt-2 p-2 rounded text-black"
        >
          {Array.from({ length: 12 }).map((_, i) => {
            return (
              <option key={i + 1} value={i + 1}>
                {i + 1} - {new Date(0, i).toLocaleString('id', { month: 'long' })}
              </option>
            );
          })}
        </select>
      </div>
      <div className="mt-6">
        <button
          onClick={() => {
            // Refresh is automatic via SWR key change; we just toggle month to force revalidation if needed
            setMonth(month);
          }}
          className="w-full bg-white text-biznet-700 p-2 rounded font-semibold"
        >
          Refresh Data
        </button>
      </div>
    </aside>
  );
}
