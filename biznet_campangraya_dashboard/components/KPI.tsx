import React from 'react';

type KPIProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function KPI({ title, value, subtitle }: KPIProps) {
  return (
    <div className="bg-white rounded p-4 shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-biznet-700">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
}
