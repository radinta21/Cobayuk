# Biznet — Campang Raya Dashboard (Next.js)

**What this package contains**
- A Next.js (TypeScript) dashboard scaffold that fetches data from your Apps Script endpoint (provided) via a serverless proxy (`/pages/api/proxy.ts`) to avoid CORS.
- Pre-built charts and KPIs for the items you requested (sales per AC, net subscribers, churn, forecasts, termination list, prospect charts, etc).
- A small static fallback (`/public/index.html`) if you prefer a static single-page app.
- `prompt.txt` — the exact prompt you requested (copy-paste to share requirements).

---
## Quick start (PC / Laptop)

1. Extract the ZIP.
2. Install dependencies:
   ```bash
   cd biznet_campangraya_dashboard
   npm install
   ```
3. Create `.env.local` in project root (optional — API URL override):
   ```
   NEXT_PUBLIC_APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbxLfuhU6Bci_zyXq-qwRIdwRv_m10IyMtPG_yE8ODNrhXgUM-R1CDJK5wqcmihfzhsa/exec"
   ```
   If you don't create `.env.local`, the app will fallback to the Apps Script URL already embedded.
4. Run locally:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Deploy to GitHub + Vercel
1. Create a new GitHub repo and push the extracted project.
2. Go to https://vercel.com, import the GitHub repo and select **Next.js**.
3. If needed, set environment variable `NEXT_PUBLIC_APPS_SCRIPT_URL` in Vercel dashboard to your Apps Script URL.
4. Deploy — Vercel will provide a public HTTPS URL accessible from desktop and mobile.

## Mobile access
- After deployment on Vercel you will have a public URL (https). Open it from any mobile browser.
- If testing locally and you need mobile access on same LAN, start dev server and open `http://<your-computer-local-ip>:3000` on mobile browser (ensure firewall allows).
- For tunnel access you can use `ngrok http 3000` and open ngrok URL on mobile.

## How data is obtained
- The site calls `/api/proxy?action=summary&year=YYYY&month=M` which forwards to your Apps Script web app at the URL you provided.
- The Apps Script is expected to return JSON (either raw sheets or pre-aggregated summary). The frontend tries to support both — if the Apps Script returns raw rows, the frontend will aggregate by Area Coordinator.

## Files of interest
- `pages/index.tsx` — main dashboard UI
- `pages/api/proxy.ts` — serverless proxy to Apps Script
- `components/Sidebar.tsx`, `components/KPI.tsx` — UI components
- `public/index.html` — static fallback + `public/script.js`, `public/style.css`
- `prompt.txt` — the exact prompt you requested (copy & paste)

---
## Notes & next steps
- You may want to improve Apps Script to return the `summary` structure expected by the frontend to avoid heavy aggregation on the client.
- If any chart or metric needs adjusting (definitions, date handling), edit `pages/index.tsx`.

