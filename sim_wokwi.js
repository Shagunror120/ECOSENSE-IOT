/*
==========================================================
ECOSENSE IOT - TELEMETRY SIMULATOR (GLOBAL RENDER SERVER)
==========================================================
Usage:
  node sim_wokwi.js          --> Sends telemetry to Global Render (https://ecosense-iot.onrender.com/sensor-data)
  node sim_wokwi.js --local  --> Sends telemetry to Localhost (http://localhost:3000/sensor-data)
==========================================================
*/

const http = require('http');
const https = require('https');

const isLocalMode = process.argv.includes('--local');

const TARGET_URL = isLocalMode
  ? 'http://localhost:3000/sensor-data'
  : 'https://ecosense-iot.onrender.com/sensor-data';

let temperature = 26.2;
let humidity = 54.0;
let batteryLevel = 84.0;
let solarCharging = true;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function sendTelemetry() {
  temperature += getRandomArbitrary(-0.25, 0.3);
  if (temperature < 24.0) temperature = 24.6;
  if (temperature > 28.8) temperature = 28.2;

  humidity += getRandomArbitrary(-0.6, 0.6);
  if (humidity < 45) humidity = 48.0;
  if (humidity > 68) humidity = 65.0;

  const airQuality = Math.floor(getRandomArbitrary(55, 95));

  if (solarCharging) {
    batteryLevel += 0.3;
  } else {
    batteryLevel -= 0.2;
  }

  if (batteryLevel > 98) {
    batteryLevel = 98;
    solarCharging = false;
  } else if (batteryLevel < 45) {
    solarCharging = true;
  }

  const payload = JSON.stringify({
    temperature: parseFloat(temperature.toFixed(2)),
    humidity: parseFloat(humidity.toFixed(2)),
    airQuality: airQuality,
    battery: parseFloat(batteryLevel.toFixed(2)),
    solar: solarCharging ? 85.0 : 0.0
  });

  const url = new URL(TARGET_URL);
  const client = url.protocol === 'https:' ? https : http;

  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = client.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`[Wokwi Sim] Sent to ${TARGET_URL} | Response (${res.statusCode}): ${data}`);
    });
  });

  req.on('error', (e) => {
    console.error(`[Wokwi Sim] Connection error to ${TARGET_URL}: ${e.message}`);
  });

  req.write(payload);
  req.end();
}

console.log("==================================================");
console.log("⚡ Starting Wokwi ESP32 Telemetry Simulator");
console.log(`📡 Targeting: ${TARGET_URL}`);
console.log("Press Ctrl+C to stop simulation");
console.log("==================================================");

sendTelemetry();
setInterval(sendTelemetry, 2500);
