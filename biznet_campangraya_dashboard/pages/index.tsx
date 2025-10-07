import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import Sidebar from '../components/Sidebar';
import KPI from '../components/KPI';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type PerAC = {
  name: string;
  newSubscribers: number;
  terminations: number;
  net: number;
  activeCustomers: number;
  suspendedCustomers: number;
  districtCounts?: Record<string, number>;
  subdistrictCounts?: Record<string, number>;
  dailyProspect?: Record<string, number>;
  prospect_subdistrict?: Record<string, number>;
  prospect_isp?: Record<string, number>;
  prospect_source?: Record<string, number>;
};

type SummaryData = {
  branchTarget?: number;
  acMonthlyTarget?: number;
  totals?: {
    newSubscribers: number;
    terminations: number;
    net: number;
    activeCustomers: number;
    suspendedCustomers: number;
  };
  perAC?: Record<string, PerAC>;
  terminationList?: Array<Record<string, any>>;
  year?: number;
  month?: number;
};

export default function Dashboard(): JSX.Element {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);

  const { data, error } = useSWR<SummaryData>(() => `/api/proxy?action=summary&year=${year}&month=${month}`, fetcher, {
    refreshInterval: 0
  });

  const acList = useMemo(
    () => [
      { code: '200202', name: 'Firza Zunaidi Firdaus' },
      { code: '200203', name: 'Imam Asari' },
      { code: '200204', name: 'Mahmud Farizi' }
    ],
    []
  );

  const totals = data?.totals ?? { newSubscribers: 0, terminations: 0, net: 0, activeCustomers: 0, suspendedCustomers: 0 };

  const salesPerAC = useMemo(() => {
    if (!data || !data.perAC) return { labels: [], values: [] };
    const labels: string[] = [];
    const values: number[] = [];
    Object.keys(data.perAC).forEach((k) => {
      labels.push(data.perAC![k].name);
      values.push(data.perAC![k].newSubscribers);
    });
    return { labels, values };
  }, [data]);

  const netPerAC = useMemo(() => {
    if (!data || !data.perAC) return { labels: [], values: [] };
    const labels: string[] = [];
    const values: number[] = [];
    Object.keys(data.perAC).forEach((k) => {
      labels.push(data.perAC![k].name);
      values.push(data.perAC![k].net);
    });
    return { labels, values };
  }, [data]);

  const churnPerAC = useMemo(() => {
    if (!data || !data.perAC) return { labels: [], values: [] };
    const labels: string[] = [];
    const values: number[] = [];
    Object.keys(data.perAC).forEach((k) => {
      const p = data.perAC![k];
      const churn = p.activeCustomers > 0 ? (p.terminations / p.activeCustomers) * 100 : 0;
      labels.push(p.name);
      values.push(Number(churn.toFixed(2)));
    });
    return { labels, values };
  }, [data]);

  if (error) return <div className="p-6">Error loading data: {String((error as Error).message)}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar year={year} month={month} setYear={setYear} setMonth={setMonth} />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-biznet-700">Dashboard Biznet — Campang Raya</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <KPI title="Target Branch (monthly)" value={data?.branchTarget ?? 100} />
          <KPI title="Net Subscriber (this month)" value={totals.net} subtitle={`New ${totals.newSubscribers} · Term ${totals.terminations}`} />
          <KPI title="Churn Rate" value={`${totals.terminations && totals.activeCustomers ? ((totals.terminations / totals.activeCustomers) * 100).toFixed(2) : '0.00'}%`} subtitle={'Target < 1%'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Penjualan per Area Coordinator</h3>
            <Bar data={{ labels: salesPerAC.labels, datasets: [{ label: 'New Subscribers', data: salesPerAC.values }] }} />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Net Subscriber per Area Coordinator</h3>
            <Bar data={{ labels: netPerAC.labels, datasets: [{ label: 'Net', data: netPerAC.values }] }} />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Churn Rate per Area Coordinator (%)</h3>
            <Line data={{ labels: churnPerAC.labels, datasets: [{ label: 'Churn %', data: churnPerAC.values, tension: 0.3 }] }} />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Forecast Net Subscriber (end of month)</h3>
            <Doughnut data={{ labels: ['Current Net', 'Forecast Remaining'], datasets: [{ data: [totals.net, Math.max(0, Math.round(totals.net * 1.2) - totals.net)] }] }} />
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Customer Terminasi (this month)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">BP ID</th>
                  <th className="p-2 text-left">Customer</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Date End</th>
                  <th className="p-2 text-left">ARCO</th>
                  <th className="p-2 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {data?.terminationList?.map((t, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{t.bp_id}</td>
                    <td className="p-2">{t.customer_name}</td>
                    <td className="p-2">{t.mobile}</td>
                    <td className="p-2">{t.date_end}</td>
                    <td className="p-2">{t.arco}</td>
                    <td className="p-2">{t.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
