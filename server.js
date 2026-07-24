const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "sensor_data.json");

// Track last external Wokwi POST time
let lastExternalPostTime = Date.now();

// =======================
// Middleware & Static Files
// =======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// =======================
// Persistent Storage Setup
// =======================
let latestData = {
  temperature: 26.5,
  humidity: 55.0,
  airQuality: 95,
  battery: 88.0,
  solar: 85.0,
  timestamp: new Date().toISOString()
};

let sensorHistory = [];

// Load existing persistent data if available
function loadPersistentData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed.latest) latestData = parsed.latest;
      if (Array.isArray(parsed.history)) sensorHistory = parsed.history;
      console.log(`[Storage] Loaded ${sensorHistory.length} historical readings from ${DATA_FILE}`);
    } else {
      savePersistentData();
    }
  } catch (err) {
    console.error("[Storage] Error loading persistent data:", err.message);
  }
}

function savePersistentData() {
  try {
    const payload = {
      latest: latestData,
      history: sensorHistory
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    // Non-fatal if read-only filesystem environment
  }
}

// Initial Data Load
loadPersistentData();

// Helper to sanitize incoming floats/ints
function parseMetric(val, fallback) {
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
}

// Helper to generate small random offset
function getRandomOffset(min, max) {
  return Math.random() * (max - min) + min;
}

// =======================
// Continuous Telemetry Simulation Ticker
// Ensures live telemetry never gets stuck on Render even if no external client is actively posting
// =======================
setInterval(() => {
  // If no external Wokwi hardware packet arrived in the last 4 seconds, auto-update telemetry
  if (Date.now() - lastExternalPostTime > 4000) {
    let temp = latestData.temperature + getRandomOffset(-0.6, 0.7);
    if (temp < 19) temp = 19.5;
    if (temp > 38) temp = 37.2;

    let hum = latestData.humidity + getRandomOffset(-1.0, 1.0);
    if (hum < 30) hum = 32.0;
    if (hum > 90) hum = 88.0;

    let aqi = Math.round(latestData.airQuality + getRandomOffset(-5, 6));
    if (aqi < 50) aqi = 55;
    if (aqi > 220) aqi = 210;

    let bat = latestData.battery + (latestData.solar > 0 ? 0.3 : -0.2);
    if (bat > 100) bat = 100;
    if (bat < 15) bat = 15;

    latestData = {
      temperature: Number(temp.toFixed(2)),
      humidity: Number(hum.toFixed(2)),
      airQuality: aqi,
      battery: Number(bat.toFixed(2)),
      solar: bat > 20 ? 85.0 : 0.0,
      timestamp: new Date().toISOString()
    };

    sensorHistory.push(latestData);
    if (sensorHistory.length > 100) {
      sensorHistory.shift();
    }
    savePersistentData();
  }
}, 2500);

// =======================
// Receive Data From Wokwi (POST /sensor-data)
// =======================
app.post("/sensor-data", (req, res) => {
  lastExternalPostTime = Date.now();
  const body = req.body || {};

  const temp = parseMetric(body.temperature, latestData.temperature);
  const hum = parseMetric(body.humidity, latestData.humidity);
  const aqi = parseMetric(body.airQuality || body.air, latestData.airQuality);
  const bat = parseMetric(body.battery, latestData.battery);
  const solar = parseMetric(body.solar, bat > 20 ? 85.0 : 0.0);

  const timestamp = new Date().toISOString();

  latestData = {
    temperature: Number(temp.toFixed(2)),
    humidity: Number(hum.toFixed(2)),
    airQuality: Math.round(aqi),
    battery: Number(bat.toFixed(2)),
    solar: Number(solar.toFixed(2)),
    timestamp: timestamp
  };

  sensorHistory.push(latestData);

  // Keep last 100 entries for rolling time-series analytics
  if (sensorHistory.length > 100) {
    sensorHistory.shift();
  }

  savePersistentData();

  console.log("---------------------------------");
  console.log(`[Wokwi Telemetry] Data Received @ ${new Date().toLocaleTimeString()}`);
  console.log(` Temp: ${latestData.temperature}°C | Humidity: ${latestData.humidity}% | AQI: ${latestData.airQuality} | Battery: ${latestData.battery}%`);
  console.log("---------------------------------");

  res.status(200).json({
    success: true,
    message: "Sensor telemetry recorded & stored successfully",
    data: latestData
  });
});

// =======================
// Latest Sensor Data Endpoint
// =======================
app.get("/data", (req, res) => {
  res.status(200).json({
    ...latestData,
    air: latestData.airQuality,
    status: latestData.battery < 20 ? "Low Power Mode" : "Online"
  });
});

// =======================
// Time-Series History Endpoint
// =======================
app.get("/history", (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const historySlice = sensorHistory.slice(-limit);
  res.status(200).json({
    count: historySlice.length,
    history: historySlice
  });
});

// =======================
// Device & System Status Endpoint
// =======================
app.get("/status", (req, res) => {
  res.status(200).json({
    server: "Online",
    device: "ESP32 Wokwi Simulation",
    totalPacketsReceived: sensorHistory.length,
    powerMode: latestData.battery < 20 ? "Low Power Mode (Deep Sleep)" : "Normal Operation",
    lastUpdate: latestData.timestamp,
    battery: latestData.battery
  });
});

// =======================
// Analytics Summary Endpoint
// =======================
app.get("/analytics", (req, res) => {
  if (sensorHistory.length === 0) {
    return res.status(200).json({
      avgTemp: latestData.temperature,
      avgHumidity: latestData.humidity,
      avgAQI: latestData.airQuality,
      dataPoints: 0
    });
  }

  const avgTemp = (sensorHistory.reduce((acc, d) => acc + d.temperature, 0) / sensorHistory.length).toFixed(1);
  const avgHum = (sensorHistory.reduce((acc, d) => acc + d.humidity, 0) / sensorHistory.length).toFixed(1);
  const avgAQI = Math.round(sensorHistory.reduce((acc, d) => acc + d.airQuality, 0) / sensorHistory.length);

  res.status(200).json({
    current: latestData,
    averages: {
      temperature: parseFloat(avgTemp),
      humidity: parseFloat(avgHum),
      airQuality: avgAQI
    },
    totalReadings: sensorHistory.length
  });
});

// =======================
// Energy Dashboard Endpoint
// =======================
app.get("/energy", (req, res) => {
  res.status(200).json({
    battery: latestData.battery,
    solarInput: latestData.solar,
    chargingStatus: latestData.solar > 0 ? "Solar Charging Active" : "Discharging",
    powerMode: latestData.battery < 20 ? "Low Power Mode Enabled" : "Normal Mode",
    harvestingEfficiency: latestData.solar > 50 ? "High (Solar)" : "Standard"
  });
});

// =======================
// Automated Alerts Endpoint
// =======================
app.get("/alerts", (req, res) => {
  const alerts = [];

  if (latestData.airQuality > 200) {
    alerts.push({ type: "danger", title: "Hazardous Air Quality", detail: `AQI is currently ${latestData.airQuality}`, time: new Date().toLocaleTimeString() });
  } else if (latestData.airQuality > 120) {
    alerts.push({ type: "warn", title: "Moderate Air Quality Warning", detail: `AQI is elevated at ${latestData.airQuality}`, time: new Date().toLocaleTimeString() });
  }

  if (latestData.battery < 20) {
    alerts.push({ type: "warn", title: "Low Battery Warning", detail: `Battery level drop to ${latestData.battery}% - Entering Low Power Mode`, time: new Date().toLocaleTimeString() });
  }

  if (latestData.temperature > 35) {
    alerts.push({ type: "warn", title: "High Temperature Warning", detail: `Temperature is ${latestData.temperature}°C`, time: new Date().toLocaleTimeString() });
  }

  if (alerts.length === 0) {
    alerts.push({ type: "ok", title: "All Systems Operational", detail: "Temperature, Air Quality, and Battery levels normal", time: new Date().toLocaleTimeString() });
  }

  res.status(200).json({ alerts });
});

// =======================
// Reset Persistent Data Endpoint
// =======================
app.post("/reset-data", (req, res) => {
  sensorHistory = [];
  latestData = {
    temperature: 25.0,
    humidity: 50.0,
    airQuality: 90,
    battery: 100.0,
    solar: 85.0,
    timestamp: new Date().toISOString()
  };
  savePersistentData();
  res.status(200).json({ success: true, message: "Storage reset successfully" });
});

// =======================
// Start Server
// =======================
app.listen(PORT, () => {
  console.log("==================================================");
  console.log(`🚀 EcoSense IoT Server is running on http://localhost:${PORT}`);
  console.log(`📊 Static Frontend: http://localhost:${PORT}`);
  console.log(`📡 Sensor Endpoint: http://localhost:${PORT}/sensor-data (POST)`);
  console.log("==================================================");
});