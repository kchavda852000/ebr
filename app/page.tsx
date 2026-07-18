"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Bell, ClipboardCheck, Droplets, FlaskConical, Gauge, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { useSimulation } from "@/app/components/simulation";

const sidebarItems = [
  "Dashboard",
  "Live Production",
  "Electronic Batch Record",
  "Batch Management",
  "Recipes",
  "Materials",
  "Equipment",
  "Quality",
  "Operators",
  "Analytics",
  "Reports",
  "Administration",
  "Settings",
] as const;

type SidebarView = (typeof sidebarItems)[number];

const cardClass = "rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur";

export default function Home() {
  const [activeView, setActiveView] = useState<SidebarView>("Dashboard");
  const {
    batches,
    recipes,
    materials,
    equipment,
    operators,
    alarms,
    deviations,
    auditTrail,
    machine,
    qualityChecks,
    notifications,
    approvalHistory,
    metrics,
  } = useSimulation();

  const trendOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 8, right: 8, top: 20, bottom: 0 },
    xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], axisLine: false },
    yAxis: { type: "value", show: false },
    series: [{
      name: "Output",
      type: "line",
      smooth: true,
      areaStyle: {},
      data: [72, 81, 77, 86, 91, 88, 95],
      lineStyle: { color: "#2563eb", width: 3 },
      itemStyle: { color: "#2563eb" },
    }],
  };

  const pieOption = {
    tooltip: { trigger: "item" },
    series: [{
      type: "pie",
      radius: [40, 80],
      data: [
        { value: 72, name: "Approved" },
        { value: 18, name: "Pending" },
        { value: 10, name: "Deviation" },
      ],
      color: ["#2563eb", "#38bdf8", "#f59e0b"],
    }],
  };

  const renderView = () => {
    if (activeView === "Dashboard") {
      return (
        <>
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Running Batches", value: metrics.runningBatches, icon: Activity },
              { label: "Completed Today", value: metrics.completedToday, icon: ClipboardCheck },
              { label: "QA Pending", value: metrics.qaPending, icon: FlaskConical },
              { label: "Released", value: metrics.released, icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`${cardClass} flex items-start justify-between`}>
                  <div>
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{item.value}</p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <Icon size={20} />
                  </div>
                </div>
              );
            })}
          </motion.section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Live Process View</p>
                  <h3 className="text-lg font-semibold text-slate-900">Batch B-2048</h3>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{machine.machineStatus}</div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Current Recipe</span>
                    <span className="rounded-full bg-white/10 px-2 py-1">{batches[0]?.recipe}</span>
                  </div>
                  <p className="mt-3 text-3xl font-semibold">{machine.currentRecipeStep}</p>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${batches[0]?.progress ?? 0}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                    <span>Progress</span>
                    <span>{batches[0]?.progress ?? 0}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Temperature", value: `${machine.temperature}°C` },
                    { label: "Pressure", value: `${machine.pressure} bar` },
                    { label: "Humidity", value: `${machine.humidity}%` },
                    { label: "RPM", value: `${machine.rpm}` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Operational Health</p>
                  <h3 className="text-lg font-semibold text-slate-900">Plant KPIs</h3>
                </div>
                <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">Live</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "OEE", value: `${metrics.oee}%`, icon: Gauge },
                  { label: "Yield", value: `${metrics.yieldRate}%`, icon: TrendingUp },
                  { label: "Energy", value: `${metrics.energy} kWh`, icon: Zap },
                  { label: "Water", value: `${metrics.water} m3`, icon: Droplets },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Icon size={16} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Performance Trend</p>
                  <h3 className="text-lg font-semibold text-slate-900">Production Trend</h3>
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">Stable</div>
              </div>
              <ReactECharts option={trendOption} style={{ height: 220 }} />
            </div>
            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Quality Distribution</p>
                  <h3 className="text-lg font-semibold text-slate-900">Release Status</h3>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">Green</div>
              </div>
              <ReactECharts option={pieOption} style={{ height: 220 }} />
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Electronic Batch Record</p>
                  <h3 className="text-lg font-semibold text-slate-900">Manufacturing Steps</h3>
                </div>
                <button className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">Generate PDF</button>
              </div>
              <div className="space-y-3">
                {recipes[0]?.steps.map((step: string, index: number) => (
                  <div key={step} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{index + 1}</div>
                      <div>
                        <p className="font-medium text-slate-900">{step}</p>
                        <p className="text-sm text-slate-500">Critical controls active</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Verified</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className={cardClass}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Active Alarms</p>
                    <h3 className="text-lg font-semibold text-slate-900">Events</h3>
                  </div>
                  <div className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">{alarms.length}</div>
                </div>
                <div className="space-y-2">
                  {alarms.map((alarm) => (
                    <div key={alarm.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{alarm.message}</p>
                        <p className="text-sm text-slate-500">{alarm.equipment}</p>
                      </div>
                      <div className={`rounded-full px-2.5 py-1 text-xs font-medium ${alarm.severity === "Critical" ? "bg-rose-100 text-rose-700" : alarm.severity === "Warning" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
                        {alarm.severity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardClass}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Notifications</p>
                    <h3 className="text-lg font-semibold text-slate-900">Center</h3>
                  </div>
                  <div className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700">Live</div>
                </div>
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{notification.title}</p>
                        <span className="text-xs text-slate-500">{notification.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Equipment</p>
                  <h3 className="text-lg font-semibold text-slate-900">Line Status</h3>
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">4 assets</div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {equipment.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <div className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "Running" ? "bg-emerald-100 text-emerald-700" : item.status === "Maintenance" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{item.status}</div>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">OEE {item.oee}% · Health {item.health}%</p>
                    <div className="mt-3 h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: `${item.health}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Audit Trail</p>
                  <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Secure</div>
              </div>
              <div className="space-y-3">
                {auditTrail.slice(0, 4).map((entry, index) => (
                  <div key={`${entry.time}-${entry.user}-${entry.module}-${entry.action}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{entry.user}</p>
                      <span className="text-xs text-slate-500">{entry.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{entry.module} · {entry.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      );
    }

    if (activeView === "Electronic Batch Record") {
      const ebrHistory = [
        { time: "08:00", temp: 28.2, pressure: 2.11, yield: 97.4, status: "Dispense" },
        { time: "08:15", temp: 29.0, pressure: 2.14, yield: 97.8, status: "Mixing" },
        { time: "08:30", temp: 30.1, pressure: 2.18, yield: 98.1, status: "Granulation" },
        { time: "08:45", temp: 30.8, pressure: 2.21, yield: 98.4, status: "Drying" },
        { time: "09:00", temp: 31.2, pressure: 2.24, yield: 98.7, status: "Blend QC" },
        { time: "09:15", temp: 31.4, pressure: 2.25, yield: 99.0, status: "Release Ready" },
      ];

      const ebrLineOption = {
        tooltip: { trigger: "axis" },
        legend: { data: ["Yield", "Temperature"] },
        grid: { left: 8, right: 8, top: 24, bottom: 0 },
        xAxis: { type: "category", data: ebrHistory.map((entry) => entry.time), axisLine: false },
        yAxis: { type: "value", show: false },
        series: [
          { name: "Yield", type: "line", smooth: true, data: ebrHistory.map((entry) => entry.yield), lineStyle: { color: "#2563eb", width: 3 } },
          { name: "Temperature", type: "line", smooth: true, data: ebrHistory.map((entry) => entry.temp), lineStyle: { color: "#14b8a6", width: 3 } },
        ],
      };

      const ebrPieOption = {
        tooltip: { trigger: "item" },
        series: [{
          type: "pie",
          radius: [40, 80],
          data: [
            { value: 46, name: "Approved" },
            { value: 28, name: "In Review" },
            { value: 16, name: "Deviation" },
          ],
          color: ["#2563eb", "#38bdf8", "#f59e0b"],
        }],
      };

      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Plant", value: "Sterile Injectable Facility" },
              { label: "Manufacturing Suite", value: "Suite A / Grade C" },
              { label: "Equipment Train", value: "Mixer · Granulator · Dryer" },
              { label: "Compliance Status", value: "CGMP Compliant" },
            ].map((item) => (
              <div key={item.label} className={`${cardClass}`}>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Historical Batch Values</p>
                  <h3 className="text-lg font-semibold text-slate-900">Line Chart</h3>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">Trend</div>
              </div>
              <ReactECharts option={ebrLineOption} style={{ height: 240 }} />
            </div>
            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Electronic Batch Record</p>
                  <h3 className="text-lg font-semibold text-slate-900">Status Distribution</h3>
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">QA View</div>
              </div>
              <ReactECharts option={ebrPieOption} style={{ height: 240 }} />
            </div>
          </div>

          <div className={cardClass}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Electronic Batch Record History</p>
                <h3 className="text-lg font-semibold text-slate-900">Historical Values Table</h3>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Audit Ready</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-2">Time</th>
                    <th className="px-3 py-2">Parameter</th>
                    <th className="px-3 py-2">Value</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ebrHistory.map((entry) => (
                    <tr key={entry.time} className="border-b border-slate-100">
                      <td className="px-3 py-2 font-medium text-slate-900">{entry.time}</td>
                      <td className="px-3 py-2">Temperature / Pressure / Yield</td>
                      <td className="px-3 py-2">{entry.temp.toFixed(1)} / {entry.pressure.toFixed(2)} / {entry.yield.toFixed(1)}</td>
                      <td className="px-3 py-2">°C / bar / %</td>
                      <td className="px-3 py-2"><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{entry.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    const viewCards = {
      "Live Production": [
        { title: "Factory Overview", value: `${machine.machineStatus} · ${machine.currentShift}` },
        { title: "Current Batch", value: batches[0]?.batchNumber ?? "B-2048" },
        { title: "Equipment Health", value: `${equipment[0]?.health ?? 94}%` },
        { title: "Alarm Count", value: `${machine.alarmCount}` },
      ],
      "Electronic Batch Record": [
        { title: "Batch Header", value: batches[0]?.batchNumber ?? "B-2048" },
        { title: "Recipe", value: recipes[0]?.name ?? "Granulation Blend" },
        { title: "QA Status", value: qualityChecks[1]?.status ?? "In Review" },
        { title: "Signatures", value: `${approvalHistory.length} approvals` },
      ],
      "Batch Management": [
        { title: "Active Batches", value: `${metrics.runningBatches}` },
        { title: "Completed", value: `${metrics.completedToday}` },
        { title: "Supervisor", value: batches[0]?.supervisor ?? "A. Patel" },
        { title: "Shift", value: batches[0]?.shift ?? "A Shift" },
      ],
      Recipes: [
        { title: "Recipe Version", value: recipes[0]?.version ?? "3.2" },
        { title: "Critical Parameters", value: recipes[0]?.criticalParameters[0] ?? "Temperature 28-32°C" },
        { title: "Materials", value: recipes[0]?.materials.length.toString() ?? "3" },
        { title: "Approval State", value: recipes[0]?.approvalState ?? "Approved" },
      ],
      Materials: [
        { title: "Inventory", value: `${materials.length} lots tracked` },
        { title: "Lowest Stock", value: `${materials[1]?.name ?? "Lactose Excipient"}` },
        { title: "Expiry Focus", value: materials[0]?.expiry ?? "2026-11-15" },
        { title: "Consumption", value: `${materials[0]?.consumption ?? 18}kg` },
      ],
      Equipment: [
        { title: "Running Assets", value: `${metrics.equipmentRunning}` },
        { title: "Maintenance", value: `${metrics.equipmentFault}` },
        { title: "Calibration", value: equipment[2]?.calibration ?? "Pending" },
        { title: "Availability", value: `${equipment[0]?.availability ?? 98}%` },
      ],
      Quality: [
        { title: "Pending Review", value: `${qualityChecks.filter((check) => check.status === "Pending" || check.status === "In Review").length}` },
        { title: "Deviation Count", value: `${deviations.length}` },
        { title: "Critical Alarm", value: alarms[0]?.message ?? "Temperature deviation" },
        { title: "Release Status", value: "Green" },
      ],
      Operators: [
        { title: "Current Shift", value: operators[0]?.shift ?? "A Shift" },
        { title: "Active Operators", value: `${metrics.activeOperators}` },
        { title: "Training", value: operators[0]?.training ?? "Certified" },
        { title: "Batches Covered", value: `${operators.length}` },
      ],
      Analytics: [
        { title: "OEE", value: `${metrics.oee}%` },
        { title: "Yield", value: `${metrics.yieldRate}%` },
        { title: "Energy", value: `${metrics.energy} kWh` },
        { title: "Steam", value: `${metrics.steam} t/hr` },
      ],
      Reports: [
        { title: "EBR PDF", value: "Ready" },
        { title: "Deviation Report", value: "Queued" },
        { title: "Yield Report", value: "Validated" },
        { title: "Operator Report", value: "Reviewed" },
      ],
      Administration: [
        { title: "Approvals", value: `${approvalHistory.length}` },
        { title: "Audit Entries", value: `${auditTrail.length}` },
        { title: "User Role", value: "Ops Lead" },
        { title: "Change Window", value: "08:00 - 10:00" },
      ],
      Settings: [
        { title: "Theme", value: "Pharma Blue" },
        { title: "Simulation Interval", value: "2s" },
        { title: "Notifications", value: "Enabled" },
        { title: "Auto Refresh", value: "On" },
      ],
    };

    const items = viewCards[activeView as keyof typeof viewCards] ?? viewCards["Live Production"];

    return (
      <div className="space-y-6">
        <div className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{activeView}</p>
              <h3 className="text-lg font-semibold text-slate-900">{activeView} Overview</h3>
            </div>
            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">Live Simulation</div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{item.title}</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className={cardClass}>
            <p className="text-sm text-slate-500">Current Context</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Operational snapshot for {activeView}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This demo view is now interactive and switches from the dashboard to the selected MES module so the sidebar becomes a real navigation surface.
            </p>
          </div>
          <div className={cardClass}>
            <p className="text-sm text-slate-500">Recent Activity</p>
            <div className="mt-3 space-y-2">
              {auditTrail.slice(0, 3).map((entry, index) => (
                <div key={`${entry.time}-${entry.user}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  {entry.user} · {entry.module}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_45%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col p-4 lg:flex-row lg:p-6">
        <aside className="mb-4 w-full rounded-[28px] border border-slate-200/70 bg-slate-950 p-5 text-slate-100 shadow-2xl lg:mb-0 lg:mr-4 lg:w-72 lg:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pharma MES</p>
              <h1 className="text-xl font-semibold">EBR Simulation</h1>
            </div>
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-2 text-cyan-300">
              <ShieldCheck size={20} />
            </div>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveView(item)}
                className={`w-full cursor-pointer rounded-2xl px-3 py-2 text-left text-sm transition ${activeView === item ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/15 to-blue-600/10 p-4">
            <p className="text-sm text-cyan-100">Live Process Confidence</p>
            <div className="mt-3 h-2 rounded-full bg-slate-800">
              <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
            </div>
            <p className="mt-2 text-xs text-slate-300">92% of critical parameters within control limits</p>
          </div>
        </aside>

        <main className="flex-1 rounded-[28px] border border-slate-200/70 bg-white/70 p-4 shadow-[0_25px_80px_-25px_rgba(15,23,42,0.30)] backdrop-blur lg:p-6">
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-200/80 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-blue-600">Manufacturing Execution</p>
              <h2 className="text-2xl font-semibold text-slate-900">{activeView}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-600">☀️</button>
              <button className="relative rounded-2xl border border-slate-200 bg-white p-2 text-slate-600">
                <Bell size={18} />
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
              </button>
              <div className="rounded-2xl border border-slate-200 bg-slate-900 px-3 py-2 text-sm text-white">Ops Lead · M.Hingol</div>
            </div>
          </header>

          {renderView()}
        </main>
      </div>
    </div>
  );
}
