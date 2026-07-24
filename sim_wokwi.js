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

let temperature = 25.5;
let humidity = 56.0;
let batteryLevel = 82.0;
let solarCharging = true;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function sendTelemetry() {
  temperature += getRandomArbitrary(-0.7, 0.8);
  if (temperature < 18) temperature = 18.5;
  if (temperature > 38) temperature = 37.5;

  humidity += getRandomArbitrary(-1.1, 1.1);
  if (humidity < 30) humidity = 32.0;
  if (humidity > 90) humidity = 88.0;

  const airQuality = Math.floor(getRandomArbitrary(60, 160));

  if (solarCharging) {
    batteryLevel += 0.4;
  } else {
    batteryLevel -= 0.3;
  }

  if (batteryLevel > 100) {
    batteryLevel = 100;
    solarCharging = false;
  } else if (batteryLevel < 35) {
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
