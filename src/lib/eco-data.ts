import { Thermometer, Droplets, Wind, Gauge, BatteryCharging, Sun } from "lucide-react";
import type { MetricTone } from "@/components/eco/MetricCard";

export const metrics: {
  icon: typeof Thermometer; label: string; value: string; unit: string; status: string;
  statusColor: "green" | "orange" | "blue"; tone: MetricTone; data: number[];
}[] = [
  { icon: Thermometer, label: "Temperature", value: "28.6", unit: "°C", status: "Normal", statusColor: "green", tone: "blue",   data: [24,25,26,27,26,28,29,28.6] },
  { icon: Droplets,    label: "Humidity",    value: "65",   unit: "%",  status: "Normal", statusColor: "green", tone: "green",  data: [60,62,61,64,63,66,65,65] },
  { icon: Wind,        label: "Air Quality (AQI)", value: "120", unit: "", status: "Moderate", statusColor: "orange", tone: "orange", data: [90,100,110,115,118,122,121,120] },
  { icon: Gauge,       label: "Pressure",    value: "1013", unit: "hPa", status: "Normal", statusColor: "green", tone: "purple", data: [1008,1010,1011,1012,1013,1014,1013,1013] },
  { icon: BatteryCharging, label: "Battery Level", value: "78", unit: "%", status: "Charging", statusColor: "green", tone: "emerald", data: [70,72,74,75,76,77,78,78] },
  { icon: Sun,         label: "Solar Input", value: "Active", unit: "", status: "Good", statusColor: "green", tone: "amber",  data: [40,55,70,85,90,88,86,84] },
];

export const liveSeries = (base: number, variance: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    t: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
    v: +(base + (Math.random() - 0.5) * variance).toFixed(1),
  }));

export const alerts = [
  { type: "warn",  title: "Air Quality is Moderate", detail: "AQI: 120",                 time: "10:24 AM" },
  { type: "ok",    title: "All Systems Normal",      detail: "Everything is working fine", time: "10:20 AM" },
  { type: "info",  title: "Solar Input Active",      detail: "Good energy harvesting",   time: "10:18 AM" },
];
