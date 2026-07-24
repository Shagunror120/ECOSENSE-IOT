// DOM Elements
const navItems = document.querySelectorAll(".nav-item");
const viewPanels = document.querySelectorAll(".view-panel");
const topbarTitle = document.getElementById("topbarTitle");
const topbarDesc = document.getElementById("topbarDesc");

// Interactive Header Popovers & Dropdowns
const teamUserBtn = document.getElementById("teamUserBtn");
const teamDropdownMenu = document.getElementById("teamDropdownMenu");
const headerBellBtn = document.getElementById("headerBellBtn");
const notificationPopover = document.getElementById("notificationPopover");
const popoverViewAlertsBtn = document.getElementById("popoverViewAlertsBtn");

// Toggle Team Dropdown
if (teamUserBtn && teamDropdownMenu) {
  teamUserBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (notificationPopover) notificationPopover.classList.remove("open");
    teamDropdownMenu.classList.toggle("open");
  });
}

// Toggle Notification Bell Popover
if (headerBellBtn && notificationPopover) {
  headerBellBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (teamDropdownMenu) teamDropdownMenu.classList.remove("open");
    notificationPopover.classList.toggle("open");
  });
}

// "View All Alerts" button inside Bell Popover
if (popoverViewAlertsBtn) {
  popoverViewAlertsBtn.addEventListener("click", () => {
    if (notificationPopover) notificationPopover.classList.remove("open");
    // Switch tab to Smart Alerts
    const alertsNavItem = document.querySelector('.nav-item[data-tab="tabAlerts"]');
    if (alertsNavItem) alertsNavItem.click();
  });
}

// Close Dropdowns on outside click
document.addEventListener("click", (e) => {
  if (teamDropdownMenu && !teamDropdownMenu.contains(e.target) && !teamUserBtn.contains(e.target)) {
    teamDropdownMenu.classList.remove("open");
  }
  if (notificationPopover && !notificationPopover.contains(e.target) && !headerBellBtn.contains(e.target)) {
    notificationPopover.classList.remove("open");
  }
});

// Metrics Elements
const valTemp = document.getElementById("valTemp");
const valHumidity = document.getElementById("valHumidity");
const valAir = document.getElementById("valAir");
const valPres = document.getElementById("valPres");
const valBattery = document.getElementById("valBattery");
const valSolar = document.getElementById("valSolar");

const tempState = document.getElementById("tempState");
const humState = document.getElementById("humState");
const airState = document.getElementById("airState");
const batteryState = document.getElementById("batteryState");
const solarState = document.getElementById("solarState");

// Status Box Elements
const connectionPill = document.getElementById("connectionPill");
const statusText = document.getElementById("statusText");
const powerModePill = document.getElementById("powerModePill");
const deviceStatusPill = document.getElementById("deviceStatusPill");
const packetCountVal = document.getElementById("packetCountVal");
const lastUpdatedVal = document.getElementById("lastUpdatedVal");

// Energy Tab Elements
const energyBatteryVal = document.getElementById("energyBatteryVal");
const energyBatteryFill = document.getElementById("energyBatteryFill");
const energySolarVal = document.getElementById("energySolarVal");
const energyModeVal = document.getElementById("energyModeVal");
const energyModeSub = document.getElementById("energyModeSub");

// Lists
const overviewTableBody = document.getElementById("overviewTableBody");
const overviewAlertsList = document.getElementById("overviewAlertsList");
const alertsFullList = document.getElementById("alertsFullList");
const bellPopoverAlertsList = document.getElementById("bellPopoverAlertsList");
const bellBadgeCount = document.getElementById("bellBadgeCount");
const navAlertCount = document.getElementById("navAlertCount");

// Tab Navigation Switching
navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove("active"));
    viewPanels.forEach(p => p.classList.remove("active"));

    item.classList.add("active");
    const targetId = item.getAttribute("data-tab");
    document.getElementById(targetId).classList.add("active");

    if (targetId === "tabOverview") {
      topbarTitle.innerText = "System Overview";
      topbarDesc.innerText = "Real-time summary of your battery-free environmental monitoring system.";
    } else if (targetId === "tabAnalytics") {
      topbarTitle.innerText = "Sensor Analytics";
      topbarDesc.innerText = "Visualize historical trends and real-time insights of environmental data.";
    } else if (targetId === "tabEnergy") {
      topbarTitle.innerText = "Energy Monitoring";
      topbarDesc.innerText = "Track energy harvesting, battery status, and power consumption in real-time.";
    } else if (targetId === "tabAlerts") {
      topbarTitle.innerText = "Smart Warning Center";
      topbarDesc.innerText = "Real-time system alerts and automated threshold notifications.";
    }
  });
});

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

// Analytics Charts
const analyticsChartTemp = makeAreaChart(document.getElementById("analyticsChartTemp").getContext("2d"), "Temp (°C)", "#2563eb", 15, 45);
const analyticsChartHum = makeAreaChart(document.getElementById("analyticsChartHum").getContext("2d"), "Humidity (%)", "#16a34a", 20, 100);
const analyticsChartAqi = makeAreaChart(document.getElementById("analyticsChartAqi").getContext("2d"), "AQI", "#ea580c", 0, 300);
const analyticsChartPres = makeAreaChart(document.getElementById("analyticsChartPres").getContext("2d"), "Pressure", "#9333ea", 990, 1030);

// Energy Charts
const chartEnergyBattery = makeAreaChart(document.getElementById("chartEnergyBattery").getContext("2d"), "Battery %", "#16a34a", 0, 100);
const chartSolarVsLoad = new Chart(document.getElementById("chartSolarVsLoad").getContext("2d"), {
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
    if (!res.ok) throw new Error("Server Error");
    const data = await res.json();

    // Connection Status
    connectionPill.classList.remove("offline");
    statusText.innerText = "ESP32 Online";
    deviceStatusPill.innerText = "Online";

    // Metrics Strip
    valTemp.innerText = data.temperature.toFixed(1);
    valHumidity.innerText = data.humidity.toFixed(1);
    const aqi = data.airQuality || data.air;
    valAir.innerText = aqi;
    valBattery.innerText = data.battery.toFixed(1);
    const solarVal = data.solar || (data.battery > 20 ? 85.0 : 0.0);
    valSolar.innerText = solarVal.toFixed(1);

    tempState.innerText = data.temperature > 35 ? "High Temp" : "Normal";
    humState.innerText = "Normal";
    airState.innerText = aqi < 100 ? "Good" : aqi < 150 ? "Moderate" : "Poor";

    if (data.battery < 20) {
      batteryState.innerText = "Low Battery";
      powerModePill.innerText = "🌙 Low Power Mode";
      energyModeVal.innerText = "LOW POWER";
      energyModeSub.innerText = "Deep Sleep Enabled";
    } else {
      batteryState.innerText = "Charging";
      powerModePill.innerText = "⚡ Normal Operation";
      energyModeVal.innerText = "ACTIVE";
      energyModeSub.innerText = "Normal Operation";
    }

    solarState.innerText = solarVal > 0 ? "Active" : "Idle";

    // Energy Tab
    energyBatteryVal.innerText = `${data.battery.toFixed(1)} %`;
    energyBatteryFill.style.height = `${data.battery}%`;
    energySolarVal.innerText = `${solarVal.toFixed(1)} W`;

    const timeStr = data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
    lastUpdatedVal.innerText = timeStr;

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
    connectionPill.classList.add("offline");
    statusText.innerText = "Server Disconnected";
    deviceStatusPill.innerText = "Offline";
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

    analyticsChartTemp.data.labels = labels; analyticsChartTemp.data.datasets[0].data = temps; analyticsChartTemp.update();
    analyticsChartHum.data.labels = labels; analyticsChartHum.data.datasets[0].data = hums; analyticsChartHum.update();
    analyticsChartAqi.data.labels = labels; analyticsChartAqi.data.datasets[0].data = aqis; analyticsChartAqi.update();
    analyticsChartPres.data.labels = labels; analyticsChartPres.data.datasets[0].data = press; analyticsChartPres.update();

    chartEnergyBattery.data.labels = labels; chartEnergyBattery.data.datasets[0].data = bats; chartEnergyBattery.update();
    chartSolarVsLoad.data.labels = labels;
    chartSolarVsLoad.data.datasets[0].data = solars;
    chartSolarVsLoad.data.datasets[1].data = solars.map(s => s > 0 ? 1.6 : 1.2);
    chartSolarVsLoad.update();

    renderOverviewTable(history);
  } catch (e) {
    console.error(e);
  }
}

function appendPoint(timeStr, temp, hum, aqi, pres, bat, solar) {
  const maxP = 20;

  [analyticsChartTemp, analyticsChartHum, analyticsChartAqi, analyticsChartPres, chartEnergyBattery].forEach(c => {
    if (c.data.labels.length >= maxP) {
      c.data.labels.shift();
      c.data.datasets[0].data.shift();
    }
  });

  if (chartSolarVsLoad.data.labels.length >= maxP) {
    chartSolarVsLoad.data.labels.shift();
    chartSolarVsLoad.data.datasets[0].data.shift();
    chartSolarVsLoad.data.datasets[1].data.shift();
  }

  analyticsChartTemp.data.labels.push(timeStr); analyticsChartTemp.data.datasets[0].data.push(temp); analyticsChartTemp.update('none');
  analyticsChartHum.data.labels.push(timeStr); analyticsChartHum.data.datasets[0].data.push(hum); analyticsChartHum.update('none');
  analyticsChartAqi.data.labels.push(timeStr); analyticsChartAqi.data.datasets[0].data.push(aqi); analyticsChartAqi.update('none');
  analyticsChartPres.data.labels.push(timeStr); analyticsChartPres.data.datasets[0].data.push(pres); analyticsChartPres.update('none');

  chartEnergyBattery.data.labels.push(timeStr); chartEnergyBattery.data.datasets[0].data.push(bat); chartEnergyBattery.update('none');
  chartSolarVsLoad.data.labels.push(timeStr);
  chartSolarVsLoad.data.datasets[0].data.push(solar);
  chartSolarVsLoad.data.datasets[1].data.push(solar > 0 ? 1.6 : 1.2);
  chartSolarVsLoad.update('none');
}

// Render Overview Table
function renderOverviewTable(history) {
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

// Fetch Alerts
async function fetchAlerts() {
  try {
    const res = await fetch("/alerts");
    if (!res.ok) return;
    const data = await res.json();
    const alerts = data.alerts || [];

    if (bellBadgeCount) bellBadgeCount.innerText = alerts.length;
    if (navAlertCount) navAlertCount.innerText = alerts.length;

    const html = alerts.map(a => `
      <div class="alert-row">
        <div class="alert-ico ${a.type === 'danger' ? 'bg-orange-soft text-orange' : 'bg-green-soft text-green'}">${a.type === 'danger' ? '⚠️' : '✓'}</div>
        <div class="alert-text">
          <div class="t">${a.title}</div>
          <div class="d">${a.detail}</div>
        </div>
        <div class="alert-time">${a.time || new Date().toLocaleTimeString()}</div>
      </div>
    `).join('');

    if (overviewAlertsList) overviewAlertsList.innerHTML = html;
    if (alertsFullList) alertsFullList.innerHTML = html;
    if (bellPopoverAlertsList) bellPopoverAlertsList.innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

// Fetch Device Status
async function fetchStatus() {
  try {
    const res = await fetch("/status");
    if (!res.ok) return;
    const data = await res.json();
    if (packetCountVal) packetCountVal.innerText = data.totalPacketsReceived || 0;
  } catch (e) {
    console.error(e);
  }
}

// Filter alerts
document.querySelectorAll(".flt-btn").forEach(b => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".flt-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
  });
});

fetchLiveData();
setInterval(fetchLiveData, 2500);