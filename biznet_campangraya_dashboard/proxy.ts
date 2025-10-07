import type { NextApiRequest, NextApiResponse } from 'next';

// Serverless proxy to avoid CORS: fetches Apps Script and returns JSON
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { year, month, action } = req.query;
  const scriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxLfuhU6Bci_zyXq-qwRIdwRv_m10IyMtPG_yE8ODNrhXgUM-R1CDJK5wqcmihfzhsa/exec';
  const y = typeof year === 'string' ? year : String(new Date().getFullYear());
  const m = typeof month === 'string' ? month : String(new Date().getMonth() + 1);
  const act = typeof action === 'string' ? action : 'summary';
  const url = `${scriptUrl}?action=${act}&year=${encodeURIComponent(y)}&month=${encodeURIComponent(m)}`;

  try {
    const r = await fetch(url);
    const json = await r.json();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(json);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}
