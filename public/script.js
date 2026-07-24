// Navigation Tabs
const navLinks = document.querySelectorAll(".nav-link");
const pageSections = document.querySelectorAll(".page-section");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove("active"));
    pageSections.forEach(s => s.classList.remove("active"));

    link.classList.add("active");
    const target = link.getAttribute("data-target");
    document.getElementById(target).classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Hero Buttons Action Handlers
const heroOpenDashboardBtn = document.getElementById("heroOpenDashboardBtn");
const heroViewLiveDataBtn = document.getElementById("heroViewLiveDataBtn");

if (heroOpenDashboardBtn) {
  heroOpenDashboardBtn.addEventListener("click", () => {
    const link = document.querySelector('.nav-link[data-target="sectionOverview"]');
    if (link) link.click();
  });
}

if (heroViewLiveDataBtn) {
  heroViewLiveDataBtn.addEventListener("click", () => {
    const link = document.querySelector('.nav-link[data-target="sectionAnalytics"]');
    if (link) link.click();
  });
}

// Popovers & Dropdowns
const teamUserBtn = document.getElementById("teamUserBtn");
const teamDropdownMenu = document.getElementById("teamDropdownMenu");
const headerBellBtn = document.getElementById("headerBellBtn");
const notificationPopover = document.getElementById("notificationPopover");
const popoverViewAlertsBtn = document.getElementById("popoverViewAlertsBtn");

if (teamUserBtn && teamDropdownMenu) {
  teamUserBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (notificationPopover) notificationPopover.classList.remove("open");
    teamDropdownMenu.classList.toggle("open");
  });
}

if (headerBellBtn && notificationPopover) {
  headerBellBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (teamDropdownMenu) teamDropdownMenu.classList.remove("open");
    notificationPopover.classList.toggle("open");
  });
}

if (popoverViewAlertsBtn) {
  popoverViewAlertsBtn.addEventListener("click", () => {
    if (notificationPopover) notificationPopover.classList.remove("open");
    const link = document.querySelector('.nav-link[data-target="sectionAlerts"]');
    if (link) link.click();
  });
}

document.addEventListener("click", (e) => {
  if (teamDropdownMenu && !teamDropdownMenu.contains(e.target) && !teamUserBtn.contains(e.target)) {
    teamDropdownMenu.classList.remove("open");
  }
  if (notificationPopover && !notificationPopover.contains(e.target) && !headerBellBtn.contains(e.target)) {
    notificationPopover.classList.remove("open");
  }
});



// DOM Metric References
const homeTemp = document.getElementById("homeTemp");
const homeHumidity = document.getElementById("homeHumidity");
const homeAir = document.getElementById("homeAir");
const homePres = document.getElementById("homePres");
const homeBattery = document.getElementById("homeBattery");
const homeSolar = document.getElementById("homeSolar");
const homeLastUpdated = document.getElementById("homeLastUpdated");

const energyBatteryVal = document.getElementById("energyBatteryVal");
const energyBatteryFill = document.getElementById("energyBatteryFill");
const energySolarVal = document.getElementById("energySolarVal");
const energyModeVal = document.getElementById("energyModeVal");
const energyModeSub = document.getElementById("energyModeSub");

const overviewTableBody = document.getElementById("overviewTableBody");
const dashPacketCount = document.getElementById("dashPacketCount");
const dashLastUpdated = document.getElementById("dashLastUpdated");
const dashDeviceOnlinePill = document.getElementById("dashDeviceOnlinePill");
const systemOnlineBadge = document.getElementById("systemOnlineBadge");

const alertsFullList = document.getElementById("alertsFullList");
const bellPopoverAlertsList = document.getElementById("bellPopoverAlertsList");
const homeQuickAlertsList = document.getElementById("homeQuickAlertsList");
const bellBadgeCount = document.getElementById("bellBadgeCount");
const navAlertBadge = document.getElementById("navAlertBadge");

// Chart Setup
Chart.defaults.color = '#64748b';
Chart.defaults.font.family = 'Outfit';

function makeAreaChart(ctx, label, color, min, max) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderColor: color,
        backgroundColor: color.replace('1)', '0.12)'),
        tension: 0.4,
        fill: true,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { min: min, max: max, grid: { color: 'rgba(226, 232, 240, 0.6)' } }
      }
    }
  });
}

const chartTemp = makeAreaChart(document.getElementById("chartTemp").getContext("2d"), "Temp (°C)", "#2563eb", 15, 45);
const chartHum = makeAreaChart(document.getElementById("chartHum").getContext("2d"), "Humidity (%)", "#16a34a", 20, 100);
const chartAqi = makeAreaChart(document.getElementById("chartAqi").getContext("2d"), "AQI", "#ea580c", 0, 300);
const chartPres = makeAreaChart(document.getElementById("chartPres").getContext("2d"), "Pressure", "#9333ea", 990, 1030);

const chartBatteryTrend = makeAreaChart(document.getElementById("chartBatteryTrend").getContext("2d"), "Battery %", "#16a34a", 0, 100);
const chartSolarVSLoad = new Chart(document.getElementById("chartSolarVSLoad").getContext("2d"), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: 'Solar Input (W)', data: [], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', tension: 0.4, fill: true },
      { label: 'Power Load (W)', data: [], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', tension: 0.4, fill: true }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { grid: { display: false } },
      y: { min: 0, max: 100, grid: { color: 'rgba(226, 232, 240, 0.6)' } }
    }
  }
});

let isFirst = true;

// Fetch Live Data
async function fetchLiveData() {
  try {
    const res = await fetch("/data");
    if (!res.ok) throw new Error("Server error");
    const data = await res.json();

    if (systemOnlineBadge) systemOnlineBadge.innerHTML = `<span class="dot-pulse"></span> ONLINE`;
    if (dashDeviceOnlinePill) dashDeviceOnlinePill.innerText = "Online";

    // Values
    if (homeTemp) homeTemp.innerText = data.temperature.toFixed(1);
    if (homeHumidity) homeHumidity.innerText = data.humidity.toFixed(1);
    const aqi = data.airQuality || data.air;
    if (homeAir) homeAir.innerText = aqi;
    if (homeBattery) homeBattery.innerText = data.battery.toFixed(1);
    const solarVal = data.solar || (data.battery > 20 ? 85.0 : 0.0);
    if (homeSolar) homeSolar.innerText = solarVal.toFixed(1);

    // Energy Values
    if (energyBatteryVal) energyBatteryVal.innerText = `${data.battery.toFixed(1)} %`;
    if (energyBatteryFill) energyBatteryFill.style.height = `${data.battery}%`;
    if (energySolarVal) energySolarVal.innerText = `${solarVal.toFixed(1)} W`;

    if (data.battery < 20) {
      if (energyModeVal) energyModeVal.innerText = "LOW POWER";
      if (energyModeSub) energyModeSub.innerText = "Deep Sleep Mode";
    } else {
      if (energyModeVal) energyModeVal.innerText = "ACTIVE";
      if (energyModeSub) energyModeSub.innerText = "Normal Mode";
    }

    const timeStr = data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
    if (homeLastUpdated) homeLastUpdated.innerText = timeStr;
    if (dashLastUpdated) dashLastUpdated.innerText = timeStr;

    if (isFirst) {
      await fetchHistory();
      isFirst = false;
    } else {
      appendPoint(timeStr, data.temperature, data.humidity, aqi, 1013, data.battery, solarVal);
    }

    fetchAlerts();
    fetchStatus();
  } catch (e) {
    console.error(e);
    if (systemOnlineBadge) systemOnlineBadge.innerHTML = `OFFLINE`;
    if (dashDeviceOnlinePill) dashDeviceOnlinePill.innerText = "Offline";
  }
}

// Fetch History
async function fetchHistory() {
  try {
    const res = await fetch("/history?limit=25");
    if (!res.ok) return;
    const json = await res.json();
    const history = json.history || [];

    const labels = history.map(d => new Date(d.timestamp).toLocaleTimeString());
    const temps = history.map(d => d.temperature);
    const hums = history.map(d => d.humidity);
    const aqis = history.map(d => d.airQuality || d.air);
    const press = history.map(d => 1013);
    const bats = history.map(d => d.battery);
    const solars = history.map(d => d.solar || 85.0);

    chartTemp.data.labels = labels; chartTemp.data.datasets[0].data = temps; chartTemp.update();
    chartHum.data.labels = labels; chartHum.data.datasets[0].data = hums; chartHum.update();
    chartAqi.data.labels = labels; chartAqi.data.datasets[0].data = aqis; chartAqi.update();
    chartPres.data.labels = labels; chartPres.data.datasets[0].data = press; chartPres.update();

    chartBatteryTrend.data.labels = labels; chartBatteryTrend.data.datasets[0].data = bats; chartBatteryTrend.update();
    chartSolarVSLoad.data.labels = labels;
    chartSolarVSLoad.data.datasets[0].data = solars;
    chartSolarVSLoad.data.datasets[1].data = solars.map(s => s > 0 ? 1.6 : 1.2);
    chartSolarVSLoad.update();

    renderTable(history);
  } catch (e) {
    console.error(e);
  }
}

function appendPoint(timeStr, temp, hum, aqi, pres, bat, solar) {
  const maxP = 20;

  [chartTemp, chartHum, chartAqi, chartPres, chartBatteryTrend].forEach(c => {
    if (c.data.labels.length >= maxP) {
      c.data.labels.shift();
      c.data.datasets[0].data.shift();
    }
  });

  if (chartSolarVSLoad.data.labels.length >= maxP) {
    chartSolarVSLoad.data.labels.shift();
    chartSolarVSLoad.data.datasets[0].data.shift();
    chartSolarVSLoad.data.datasets[1].data.shift();
  }

  chartTemp.data.labels.push(timeStr); chartTemp.data.datasets[0].data.push(temp); chartTemp.update('none');
  chartHum.data.labels.push(timeStr); chartHum.data.datasets[0].data.push(hum); chartHum.update('none');
  chartAqi.data.labels.push(timeStr); chartAqi.data.datasets[0].data.push(aqi); chartAqi.update('none');
  chartPres.data.labels.push(timeStr); chartPres.data.datasets[0].data.push(pres); chartPres.update('none');

  chartBatteryTrend.data.labels.push(timeStr); chartBatteryTrend.data.datasets[0].data.push(bat); chartBatteryTrend.update('none');
  chartSolarVSLoad.data.labels.push(timeStr);
  chartSolarVSLoad.data.datasets[0].data.push(solar);
  chartSolarVSLoad.data.datasets[1].data.push(solar > 0 ? 1.6 : 1.2);
  chartSolarVSLoad.update('none');
}

function renderTable(history) {
  if (!overviewTableBody) return;
  const recent = history.slice(-5).reverse();
  overviewTableBody.innerHTML = recent.map(r => `
    <tr>
      <td><strong>${r.temperature}°C</strong> (Temp)</td>
      <td>${r.temperature}°C</td>
      <td><span class="pill-online">${(r.airQuality || r.air) < 120 ? 'Normal' : 'Moderate'}</span></td>
      <td style="text-align:right;">${new Date(r.timestamp).toLocaleTimeString()}</td>
    </tr>
  `).join('');
}

async function fetchAlerts() {
  try {
    const res = await fetch("/alerts");
    if (!res.ok) return;
    const data = await res.json();
    const alerts = data.alerts || [];

    if (bellBadgeCount) bellBadgeCount.innerText = alerts.length;
    if (navAlertBadge) navAlertBadge.innerText = alerts.length;

    const html = alerts.map(a => `
      <div class="alert-row ${a.type || 'ok'}">
        <div class="alert-ico">${a.type === 'danger' ? '⚠️' : '✓'}</div>
        <div>
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.detail}</div>
        </div>
      </div>
    `).join('');

    if (alertsFullList) alertsFullList.innerHTML = html;
    if (bellPopoverAlertsList) bellPopoverAlertsList.innerHTML = html;
    if (homeQuickAlertsList) homeQuickAlertsList.innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

async function fetchStatus() {
  try {
    const res = await fetch("/status");
    if (!res.ok) return;
    const data = await res.json();
    if (dashPacketCount) dashPacketCount.innerText = data.totalPacketsReceived || 0;
  } catch (e) {
    console.error(e);
  }
}

fetchLiveData();
setInterval(fetchLiveData, 2500);