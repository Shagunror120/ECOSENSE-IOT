# EcoSense IoT — Master Technical Specification & Comprehensive Project Manual

---

## 📄 Abstract & Executive Summary

**EcoSense IoT** is an end-to-end, battery-free, smart environmental monitoring solution engineered at the intersection of **Embedded Systems Engineering** and **Full-Stack Computer Science**. 

Traditional Internet of Things (IoT) deployments rely heavily on conventional lithium batteries. In large-scale environmental sensing (such as agricultural fields, smart cities, or remote forest monitoring), replacing thousands of depleted batteries is economically expensive, labor-intensive, and environmentally hazardous due to toxic battery waste. 

**EcoSense IoT** solves this fundamental bottleneck by implementing **Solar Energy Harvesting** coupled with intelligent power management (Deep Sleep switching) on an ESP32 microcontroller node. The node continuously measures temperature, humidity, atmospheric pressure, and air quality index (AQI). Telemetry packets are serialized into JSON and wirelessly transmitted over Wi-Fi via RESTful HTTP POST requests to a cloud backend hosted on Render. 

The cloud server (built with Node.js and Express) ingests the telemetry stream, maintains persistent storage, computes time-series rolling averages, generates automated warning alerts, and serves a modern, responsive web application featuring **3 consecutive interactive dashboards** for real-time monitoring and analytics.

---

## 🎯 1. Project Background, Problem Statement & Core Objectives

### A. The Core Problem Statement
1. **Battery Maintenance Overhead**: Wireless sensor networks (WSNs) deployed in remote or harsh environments require periodic battery replacements, causing significant maintenance downtime and expense.
2. **Environmental Degradation**: Spent chemical batteries generate massive hazardous electronic waste (e-waste).
3. **Lack of Real-Time Visibility**: Legacy environmental logging systems store data locally on SD cards without real-time cloud accessibility or automated warning alerts.

### B. Project Objectives
- **Zero Battery Dependency**: Build a self-sustaining IoT node using simulated solar energy harvesting and dynamic power state management.
- **Wireless Telemetry Ingestion**: Establish an HTTP POST REST protocol bridging the ESP32 hardware/Wokwi simulator with a cloud backend.
- **Robust Cloud Backend**: Develop an Express.js server providing persistent storage, rolling time-series analytics, and real-time alert generation.
- **Interactive Multi-Dashboard Frontend**: Create a modern web interface with 3 specialized dashboards (Analytics, Energy, Alerts) and full mobile-responsive aesthetics.

---

## 🔌 2. Embedded Engineering & Hardware Circuit Architecture

The embedded hardware tier represents the physical or simulated sensing node that captures environmental parameters and manages power consumption.

```
       +-------------------------------------------------------------------+
       |                       ESP32 MICROCONTROLLER                       |
       |                                                                   |
       |   +-------------------+    +------------------+   +-----------+   |
       |   | DHT22 Temp/Humid  |    | AQI Gas Sensor   |   | I2C OLED  |   |
       |   | (Pin GPIO 15)     |    | (Simulated ADC)  |   | (SSD1306) |   |
       |   +-------------------+    +------------------+   +-----------+   |
       |                                                                   |
       |   +-----------------------------------------------------------+   |
       |   | Solar Panel & Supercapacitor Virtual Energy Circuit       |   |
       |   +-----------------------------------------------------------+   |
       +-------------------------------------------------------------------+
                                         |
                            WiFi Connection (HTTP POST)
                                         v
                         Cloud Server (Render / Node.js)
```

### A. Hardware Component Deep-Dive
1. **ESP32 Microcontroller Core**:
   - **Architecture**: Xtensa dual-core 32-bit LX6 microprocessor operating up to 240 MHz.
   - **Wireless Connectivity**: Integrated 2.4 GHz Wi-Fi (802.11 b/g/n) and Bluetooth v4.2 BR/EDR & BLE.
   - **Power Management**: Supports Active Mode (160–260 mA), Modem Sleep, Light Sleep, and **Deep Sleep** (~10 µA current draw).
2. **DHT22 Digital Temperature & Humidity Sensor**:
   - **Temperature Range**: -40°C to +80°C (accuracy ±0.5°C).
   - **Humidity Range**: 0% to 100% RH (accuracy ±2-5% RH).
   - **Signal Protocol**: Single-bus digital signal connected to GPIO 15.
3. **Air Quality Index (AQI) Sensor Node (MQ-135 Simulation)**:
   - Measures ambient air pollutants including CO2, NH3, Smoke, and VOCs. Outputs a normalized AQI index value (50–250+).
4. **SSD1306 OLED Display (128x64 Pixels, Monochrome, I2C)**:
   - **Communication Protocol**: Inter-Integrated Circuit (I2C) bus via SDA (GPIO 21) and SCL (GPIO 22).
   - **Function**: Renders local diagnostics on the physical device, including current temperature, humidity, battery percentage, and operating state (`NORMAL` vs `LOW POWER MODE`).
5. **Solar Energy Harvesting & Buffer Subsystem**:
   - Simulates a photovoltaic solar panel generating up to 85.0 Watts equivalent charging input.
   - Charges a supercapacitor/battery buffer.
   - **Power State Machine Logic**:
     - **Battery Level > 20%**: Normal active operation. Wi-Fi remains connected, sensor readings occur every 2.5–3.0 seconds.
     - **Battery Level ≤ 20%**: Low Power Mode triggered. Display updates to `LOW POWER`, polling interval relaxes to 5.0 seconds, preserving reserve power.

### B. Firmware Software Design (`wokwi/sketch.ino`)
The ESP32 firmware is written in C++ using the Arduino core library stack (`WiFi.h`, `HTTPClient.h`, `Wire.h`, `DHTesp.h`, `Adafruit_SSD1306.h`).

#### Execution Lifecycle:
1. `setup()`: Initializes Serial communication at 115200 baud, sets up pin modes, initializes OLED I2C bus (`0x3C`), connects to the Wi-Fi access point (`Wokwi-GUEST`), and logs initial system configuration.
2. `loop()`:
   - **Sampling**: Reads DHT22 sensor data (`dhtSensor.getTempAndHumidity()`) and computes simulated solar charging offsets.
   - **Display Update**: Clears OLED buffer and draws formatted telemetry strings on the screen.
   - **JSON Serialization**: Constructs a lightweight JSON string:
     ```json
     {
       "temperature": 27.50,
       "humidity": 54.20,
       "airQuality": 98,
       "battery": 84.50,
       "solar": 85.00
     }
     ```
   - **Network Transmission**: Opens an HTTP connection to `https://ecosense-iot.onrender.com/sensor-data`, sets header `Content-Type: application/json`, and executes `http.POST(jsonData)`. Checks the HTTP status code (200 OK) and safely terminates the connection (`http.end()`).

---

## 💻 3. Computer Science & Software Engineering (Cloud Backend & Database)

The backend layer is an asynchronous, event-driven server responsible for receiving telemetry, validating data structures, maintaining persistent storage, calculating statistical analytics, and generating real-time warnings.

```
       +---------------------------------------------------------------+
       |                      NODE.JS / EXPRESS SERVER                 |
       |                                                               |
       |   +-----------------------+       +-----------------------+   |
       |   | REST Ingestion Router |       | Persistence Layer     |   |
       |   | (POST /sensor-data)   | ----> | (sensor_data.json &   |   |
       |   +-----------------------+       | Rolling 100 Buffer)   |   |
       |                                   +-----------------------+   |
       |   +-----------------------+                   |               |
       |   | Automated Warning     | <-----------------+               |
       |   | Threshold Engine      |                                   |
       |   +-----------------------+                                   |
       |               |                                               |
       |               v                                               |
       |   +-------------------------------------------------------+   |
       |   | REST API Outgoing Endpoints                           |   |
       |   | (/data, /history, /analytics, /energy, /alerts)       |   |
       |   +-------------------------------------------------------+   |
       +---------------------------------------------------------------+
```

### A. Technology Stack & Server Environment
- **Runtime Environment**: Node.js (v18+ / CommonJS module system).
- **Web Framework**: Express.js (v4/v5).
- **Middleware**:
  - `cors()`: Enables Cross-Origin Resource Sharing for browser access.
  - `express.json()`: Parses incoming JSON request bodies.
  - `express.static('public')`: Serves static web assets (HTML, CSS, JS, images).
- **Host Infrastructure**: Render Web Service platform with environment variable binding (`process.env.PORT`).

### B. RESTful API Contract & Endpoints
1. `POST /sensor-data`:
   - **Purpose**: Ingests telemetry packets from ESP32 hardware or simulation clients.
   - **Validation**: Sanitizes inputs with fallback parsing (`parseFloat`). Updates `latestData` and appends to `sensorHistory` array. Limits memory queue size to 100 rolling records. Writes snapshot to disk.
2. `GET /data`:
   - **Purpose**: Returns the single most recent sensor snapshot for immediate rendering on live metric cards.
3. `GET /history?limit=N`:
   - **Purpose**: Returns the historical time-series array (up to N items, default 50) for Chart.js rendering.
4. `GET /analytics`:
   - **Purpose**: Computes rolling mathematical averages across historical data points for temperature, humidity, and air quality.
5. `GET /energy`:
   - **Purpose**: Returns solar harvesting status, battery percentage, power mode (`ACTIVE` vs `LOW POWER`), and harvesting efficiency classification.
6. `GET /alerts`:
   - **Purpose**: Evaluates rules against latest sensor data and returns active alerts:
     - 🚨 **Hazardous AQI**: `airQuality > 200`
     - ⚠️ **Elevated AQI Warning**: `120 < airQuality ≤ 200`
     - ⚠️ **High Temperature Warning**: `temperature > 35°C`
     - ⚡ **Low Battery Warning**: `battery < 20%`
     - ✅ **All Systems Operational**: Returned when no threshold triggers are violated.
7. `GET /status`:
   - **Purpose**: Reports total packets processed, device connectivity state, power mode, and server uptime health.

### C. Persistent Storage Architecture (`sensor_data.json`)
- Rather than requiring heavy external database installations for lightweight deployments, the server implements a fast **JSON File Storage Engine**:
  - Reads existing records from `sensor_data.json` upon server startup (`loadPersistentData()`).
  - Writes data snapshots atomically using Node.js `fs.writeFileSync()` on every incoming valid packet (`savePersistentData()`).
  - Prevents memory leaks by capping `sensorHistory` array length at 100 entries.

### D. Non-Stop Telemetry Simulation Ticker
- To ensure that the live cloud website on Render (`https://ecosense-iot.onrender.com`) continuously animates metrics and line graphs even when no physical hardware is actively posting, `server.js` contains a background interval loop (`setInterval` every 2500ms):
  - Tracks `lastExternalPostTime`.
  - If no external packet arrives within 4.0 seconds, the server automatically simulates natural, realistic environmental drift (fluctuating temperature by ±0.6°C, humidity by ±1.0%, AQI by ±5 points, and updating solar battery states).
  - When physical ESP32 packets arrive, `lastExternalPostTime` updates, allowing real hardware data to seamlessly override the background ticker.

---

## 🎨 4. Frontend Design System & User Experience Architecture

The frontend is a lightweight Single Page Application (SPA) designed with maximum visual excellence, modern light aesthetics, dynamic micro-animations, and full mobile responsiveness.

### A. Design System & CSS Tokens (`public/style.css`)
- **Color Palette**:
  - Background: Clean off-white (`#f8fafc`).
  - Cards: Crisp white (`#ffffff`) with subtle drop shadows (`box-shadow: 0 4px 12px rgba(15,23,42,0.03)`).
  - Primary Green: `#16a34a` (soft background `#dcfce7`).
  - Primary Blue: `#2563eb` (soft background `#dbeafe`).
  - Accent Orange: `#ea580c` (soft background `#ffedd5`).
  - Accent Purple: `#9333ea` (soft background `#f3e8ff`).
- **Typography**: Google Fonts **Outfit** (weights 300 to 800) for crisp, modern digital readability.

### B. Interactive Layout Components (`public/index.html` & `public/script.js`)
1. **Top Navigation Header**:
   - Brand logo (`🌿 EcoSense IoT`).
   - Section navigation links (`Home`, `Dashboard`, `Analytics`, `Energy Monitor`, `Alerts`, `About & Team`).
   - ☀️ 25°C Sunny weather pill.
   - **Notification Bell Popover (`#headerBellBtn`)**: Interactive popover displaying real-time warning counts (`#bellBadgeCount`) and warning cards with a direct button to switch to the Smart Warning section.
   - **Team EcoSense Dropdown (`#teamUserBtn`)**: Custom dropdown listing clean names of project team members:
     - **Ananya Tripathi**
     - **Shagun Ror**
     - **Vaishnavi Saxena**

2. **Section 1: Hero Landing Page & Home View**:
   - Large modern headline: *"Battery-Free Smart Environmental Monitoring System"*.
   - Action buttons (`Open Dashboard →`, `View Live Data`, `System Architecture`).
   - Hero graphic illustration featuring an interactive ESP32 chip graphic, solar panel cell representation, and floating metric pills.
   - Live System Status Card showing `ONLINE` pulse indicator, Device ID `ES-2024-001`, and live timestamp.

3. **6 Metric Cards Strip**:
   - Displays real-time Temperature (°C), Humidity (%), Air Quality (AQI), Pressure (hPa), Battery Level (%), and Solar Input (W).

4. **3 Consecutive Sub-Dashboards**:
   - 📊 **Dashboard 1: Sensor Analytics (`#sectionAnalytics`)**:
     - 4 multi-axis Chart.js area charts for **Temperature**, **Humidity**, **Air Quality Index**, and **Barometric Pressure**.
     - Live updating telemetry history table.
   - ⚡ **Dashboard 2: Energy Monitor (`#sectionEnergy`)**:
     - Vertical animated battery gauge with percentage fill.
     - Solar input wattage card with grid pattern indicator.
     - Power consumption card (1.6W Low Drain Mode).
     - System Mode indicator (`ACTIVE` vs `LOW POWER`).
     - Line charts comparing Battery Level Trend (%) and Solar Input vs Power Consumption Load (W).
     - Energy Harvesting Flow diagram (*Solar Panel ➔ Charging Circuit ➔ Battery Buffer ➔ ESP32 Microcontroller*).
   - 🔔 **Dashboard 3: Smart Warning Center (`#sectionAlerts`)**:
     - Automated system alert feed categorized by severity.
     - Filter buttons (`All Alerts`, `Warnings`, `Critical`, `Normal`).

5. **Section 6: About & Team View**:
   - Detailed project description narrative.
   - Project Team Members clean list showing **Ananya Tripathi**, **Shagun Ror**, and **Vaishnavi Saxena**.

---

## 📡 5. Standalone Telemetry Simulator (`sim_wokwi.js`)

To facilitate automated testing and cloud data streaming without relying on physical hardware availability, a Node.js simulator script is included in the root project directory.

- **Execution Modes**:
  - Default / Render Mode: `node sim_wokwi.js` (Targets `https://ecosense-iot.onrender.com/sensor-data`).
  - Local Mode: `node sim_wokwi.js --local` (Targets `http://localhost:3000/sensor-data`).
- **Algorithm**:
  - Maintains continuous state for temperature, humidity, battery, and solar charging.
  - Applies random Gaussian-like noise to temperature and humidity.
  - Simulates solar charge cycles (battery charges up to 100%, then discharges to 35% before solar charging reactivates).
  - Formats JSON payload and issues HTTPS POST requests every 2500ms using Node.js native `https` module with SSL bypass options (`rejectUnauthorized: false`).

---

## 🔁 6. Comprehensive System Data Flow Matrix

| Stage | Trigger / Frequency | Component Involved | Action Performed | Data Payload Format |
| :--- | :--- | :--- | :--- | :--- |
| **1. Sensing** | Every 2.5 sec | ESP32 / DHT22 / AQI Sensor | Reads physical environment / generates simulated telemetry. | Raw float / int variables |
| **2. Display** | Every 2.5 sec | SSD1306 OLED (I2C) | Formats and draws text lines on local hardware screen. | String text commands |
| **3. Telemetry Transmission** | Every 2.5 sec | ESP32 Wi-Fi / `sim_wokwi.js` | Executes HTTP POST request over TCP/IP to cloud backend. | JSON object string |
| **4. Cloud Ingestion** | On POST Request | Render Server (`server.js`) | Validates data, updates `latestData`, pushes to `sensorHistory`. | JSON response `{success: true}` |
| **5. Storage Sync** | On Ingestion | Node.js File System (`fs`) | Writes latest snapshot to `sensor_data.json`. | Disk JSON file |
| **6. Frontend Polling** | Every 2.5 sec | Web Browser (`script.js`) | Executes HTTP GET `/data`, `/history`, `/alerts` endpoints. | JSON object response |
| **7. UI Rendering** | On GET Response | Client DOM / Chart.js | Updates 6 metric boxes, 6 Chart.js graphs, tables, and alert badges. | DOM element updates |

---

## 🚀 7. Deployment & DevOps Pipeline

- **Version Control System**: Git repository hosted on GitHub at `https://github.com/Shagunror120/ECOSENSE-IOT.git`.
- **Branching Strategy**: Production code deployed on `main` branch.
- **Continuous Deployment (CD)**: Render Web Service connected via GitHub webhook. Every `git push origin main` automatically triggers Render to pull changes, execute `npm install`, and launch `node server.js`.
- **Production URL**: **`https://ecosense-iot.onrender.com`**

---

## 🌐 8. Potential Real-World Applications & Industry Impact

1. **Smart Agriculture & Precision Farming**: Deploying solar-powered, battery-free sensors across large agricultural fields to monitor soil temperature and ambient humidity without ever replacing batteries.
2. **Forest Fire Early Warning Systems**: Solar-harvesting nodes deployed in remote forest canopies to continuously monitor heat anomalies and air smoke levels, sending automated warnings directly to emergency servers.
3. **Smart Cities & Air Quality Surveillance**: Municipal installation of low-cost environmental nodes on streetlights to measure urban pollution index (AQI) in real time.
4. **Industrial Ambient Monitoring**: Continuous environmental tracking inside chemical warehouses or pharmaceutical facilities.

---

## 👥 Project Team
- **Ananya Tripathi**
- **Shagun Ror**
- **Vaishnavi Saxena**
