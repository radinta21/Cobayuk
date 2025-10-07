const API_URL = (typeof window !== 'undefined' && window.location.origin) ? (window.location.origin + '/api/proxy?action=raw') : 'https://script.google.com/macros/s/AKfycbxLfuhU6Bci_zyXq-qwRIdwRv_m10IyMtPG_yE8ODNrhXgUM-R1CDJK5wqcmihfzhsa/exec';

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await fetch(API_URL).then(res => res.json());
    console.log("Data fetched (fallback):", data);
  } catch (e) {
    console.warn("Could not fetch via proxy, try direct Apps Script URL from script.js constant.");
  }

  // Dummy contoh visualisasi (nanti bisa disesuaikan dengan data asli)
  const labels = ["Firza", "Imam", "Mahmud"];
  const salesData = [50, 35, 60];
  const netData = [45, 32, 58];
  const churnData = [0.5, 0.9, 0.8];

  // Forecast sederhana
  const forecastEl = document.getElementById("forecastValue");
  if (forecastEl) forecastEl.innerText = Math.round(netData.reduce((a,b)=>a+b,0)*1.1);

  new Chart(document.getElementById("salesChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Penjualan",
        data: salesData
      }]
    }
  });

  new Chart(document.getElementById("netChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Net Subscriber",
        data: netData
      }]
    }
  });

  new Chart(document.getElementById("churnChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Churn Rate (%)",
        data: churnData,
        fill: false
      }]
    }
  });
});
