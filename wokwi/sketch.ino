/*
==========================================================
ECOSENSE IOT - BATTERY-FREE SMART ENVIRONMENT MONITORING SYSTEM
==========================================================

FEATURES:
✅ ESP32 Simulation
✅ DHT22 Temperature + Humidity
✅ OLED Display (SSD1306)
✅ Simulated Air Quality & Energy Harvesting Logic
✅ WiFi Connection
✅ HTTP REST Telemetry Posting to Global Render Backend Server
✅ Wokwi Simulator Compatible (SSL/TLS Secure Client Supported)

==========================================================
WOKWI CONNECTIONS
==========================================================
DHT22: VCC -> 3.3V | GND -> GND | DATA -> GPIO 15
OLED:  VCC -> 3.3V | GND -> GND | SDA -> GPIO 21 | SCL -> GPIO 22
==========================================================
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include "DHTesp.h"
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ======================================================
// WIFI CONFIGURATION
// ======================================================
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// ======================================================
// GLOBAL BACKEND API URL (LIVE RENDER DEPLOYMENT)
// ======================================================
String serverName = "https://ecosense-iot.onrender.com/sensor-data";

// ======================================================
// DHT22 SENSOR & OLED CONFIGURATION
// ======================================================
const int DHT_PIN = 15;
DHTesp dhtSensor;

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// ======================================================
// VIRTUAL ENERGY HARVESTING VARIABLES
// ======================================================
float batteryLevel = 75.0;
bool solarCharging = true;
bool deepSleepMode = false;

void setup() {
  Serial.begin(115200);

  // Start DHT22 Sensor
  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);

  // Start OLED Display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED NOT FOUND");
    while(true);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);

  // Connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi Connected!");
  Serial.println("=================================");
  Serial.println("ECOSENSE IOT SYSTEM STARTED");
  Serial.print("Server URL: "); Serial.println(serverName);
  Serial.println("=================================");
}

void loop() {
  // Read DHT22 Sensor
  TempAndHumidity data = dhtSensor.getTempAndHumidity();
  float temperature = data.temperature;
  float humidity = data.humidity;

  if (isnan(temperature)) temperature = 25.0;
  if (isnan(humidity)) humidity = 50.0;

  int airQuality = random(50, 180);

  // Simulated Solar Energy Harvesting
  if(solarCharging) {
    batteryLevel += 0.3;
  }
  batteryLevel -= 0.1;

  if(batteryLevel > 100) batteryLevel = 100;
  if(batteryLevel < 0) batteryLevel = 0;

  deepSleepMode = (batteryLevel < 20);

  // Serial Monitor Output
  Serial.println("=================================");
  Serial.print("Temperature: "); Serial.print(temperature); Serial.println(" C");
  Serial.print("Humidity: "); Serial.print(humidity); Serial.println(" %");
  Serial.print("Air Quality: "); Serial.println(airQuality);
  Serial.print("Battery Level: "); Serial.print(batteryLevel); Serial.println(" %");
  Serial.println(deepSleepMode ? "MODE: LOW POWER" : "MODE: NORMAL");

  // OLED Display Output
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("ECOSENSE IOT SYSTEM");
  display.println("----------------");
  display.print("Temp: "); display.print(temperature); display.println(" C");
  display.print("Humidity: "); display.print(humidity); display.println(" %");
  display.print("AQI: "); display.println(airQuality);
  display.print("Battery: "); display.print(batteryLevel, 1); display.println(" %");
  display.println(deepSleepMode ? "LOW POWER MODE" : "NORMAL MODE");
  display.display();

  // Send Telemetry Data to Global Render Server (Secure TLS Client)
  if(WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // Bypass SSL cert verification in Wokwi simulator

    HTTPClient http;
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{";
    jsonData += "\"temperature\":" + String(temperature, 2) + ",";
    jsonData += "\"humidity\":" + String(humidity, 2) + ",";
    jsonData += "\"airQuality\":" + String(airQuality) + ",";
    jsonData += "\"battery\":" + String(batteryLevel, 2) + ",";
    jsonData += "\"solar\":" + String(solarCharging ? 85.0 : 0.0, 2);
    jsonData += "}";

    int httpResponseCode = http.POST(jsonData);
    Serial.print("Telemetry Posted to Render. HTTP Response: ");
    Serial.println(httpResponseCode);

    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }

  delay(deepSleepMode ? 5000 : 3000);
}
