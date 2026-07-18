"use client";

import { useEffect, useMemo, useState } from "react";
import type { Batch, Equipment, Operator, Notification, Alarm, Deviation, AuditEntry, MachineSnapshot, QualityCheck, Material, Recipe, ApprovalRecord } from "@/app/types";
import { simulationConfig } from "@/app/lib/simulationConfig";
import batchesData from "@/mock/batches.json";
import recipesData from "@/mock/recipes.json";
import materialsData from "@/mock/materials.json";
import equipmentData from "@/mock/equipment.json";
import operatorsData from "@/mock/operators.json";
import alarmsData from "@/mock/alarms.json";
import deviationsData from "@/mock/deviations.json";
import auditTrailData from "@/mock/auditTrail.json";
import machineData from "@/mock/machineData.json";
import qualityChecksData from "@/mock/qualityChecks.json";
import notificationsData from "@/mock/notifications.json";
import approvalHistoryData from "@/mock/approvalHistory.json";

export function useSimulation() {
  const [batches, setBatches] = useState<Batch[]>(batchesData as Batch[]);
  const [recipes, setRecipes] = useState<Recipe[]>(recipesData as Recipe[]);
  const [materials, setMaterials] = useState<Material[]>(materialsData as Material[]);
  const [equipment, setEquipment] = useState<Equipment[]>(equipmentData as Equipment[]);
  const [operators, setOperators] = useState<Operator[]>(operatorsData as Operator[]);
  const [alarms, setAlarms] = useState<Alarm[]>(alarmsData as Alarm[]);
  const [deviations, setDeviations] = useState<Deviation[]>(deviationsData as Deviation[]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(auditTrailData as AuditEntry[]);
  const [machine, setMachine] = useState<MachineSnapshot>(machineData as MachineSnapshot);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(qualityChecksData as QualityCheck[]);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData as Notification[]);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalRecord[]>(approvalHistoryData as ApprovalRecord[]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((value) => value + 1);
      setMachine((current) => ({
        ...current,
        temperature: Number((current.temperature + (Math.random() - 0.5) * simulationConfig.randomization.temperatureDelta).toFixed(1)),
        pressure: Number((current.pressure + (Math.random() - 0.5) * simulationConfig.randomization.pressureDelta).toFixed(2)),
        humidity: Number((current.humidity + (Math.random() - 0.5) * simulationConfig.randomization.humidityDelta).toFixed(1)),
        rpm: Math.max(120, Math.min(185, current.rpm + Math.round((Math.random() - 0.5) * simulationConfig.randomization.rpmDelta))),
        tankLevel: Math.max(40, Math.min(92, current.tankLevel + Math.round((Math.random() - 0.5) * simulationConfig.randomization.tankLevelDelta))),
        weight: current.weight + simulationConfig.randomization.weightDelta,
        batchProgress: Math.min(100, current.batchProgress + simulationConfig.randomization.progressDelta),
        remainingTime: Math.max(0, current.remainingTime - simulationConfig.randomization.remainingTimeDelta),
        machineStatus: current.batchProgress > 90 ? "Completed" : "Running",
        operatorStatus: current.batchProgress > 90 ? "Release Ready" : "Active",
        currentRecipeStep: current.batchProgress > 80 ? "Transfer / Cleaning" : current.currentRecipeStep,
        alarmCount: current.alarmCount > 0 ? current.alarmCount : 3,
        oee: Number((current.oee + (Math.random() - 0.5) * simulationConfig.randomization.oeeDelta).toFixed(1)),
        yield: Number((current.yield + (Math.random() - 0.5) * simulationConfig.randomization.yieldDelta).toFixed(1)),
        energy: current.energy + 3,
        water: current.water + 1,
        steam: current.steam + 2,
      }));

      setBatches((current) =>
        current.map((batch, index) =>
          index === 0
            ? {
                ...batch,
                progress: Math.min(100, batch.progress + 1),
                status: batch.progress > 90 ? "Completed" : "Running",
                currentStep: batch.progress > 80 ? "Transfer / Cleaning" : batch.currentStep,
              }
            : batch,
        ),
      );

      setEquipment((current) =>
        current.map((item, index) => ({
          ...item,
          availability: Math.min(99, Number((item.availability + (Math.random() - 0.5) * 0.7).toFixed(1))),
          performance: Math.min(99, Number((item.performance + (Math.random() - 0.5) * 0.8).toFixed(1))),
          runtime: item.runtime + 1,
          oee: Math.min(99, Number((item.oee + (Math.random() - 0.5) * 0.4).toFixed(1))),
          health: Math.min(99, Number((item.health + (Math.random() - 0.5) * 1.3).toFixed(1))),
          status: index === 0 ? "Running" : index === 1 ? "Running" : index === 2 ? "Idle" : "Maintenance",
        })),
      );

      setOperators((current) =>
        current.map((operator, index) => ({
          ...operator,
          performance: Math.min(99, Number((operator.performance + (Math.random() - 0.5) * 0.7).toFixed(1))),
          status: index === 0 ? "Active" : index === 1 ? "Ready" : "Standby",
        })),
      );

      setMaterials((current) =>
        current.map((material, index) => ({
          ...material,
          stock: Math.max(40, material.stock - (index === 0 ? 0.4 : 0.3)),
          consumption: material.consumption + (index === 0 ? 0.3 : 0.2),
        })),
      );

      setQualityChecks((current) =>
        current.map((check) =>
          check.id === "QC-02"
            ? { ...check, status: check.status === "Pending" ? "In Review" : "Pending" }
            : check,
        ),
      );

      setNotifications((current) => [
        {
          id: Date.now(),
          title: current[0].title,
          message: current[0].message,
          time: "now",
          tone: current[0].tone,
        },
        ...current.slice(0, 2),
      ]);

      setAuditTrail((current) => [
        {
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          user: "MES System",
          module: "Live Data",
          action: "Updated",
          oldValue: "Stable",
          newValue: "Live",
          reason: "Simulation refresh",
          ip: "10.24.16.01",
        },
        ...current.slice(0, 4),
      ]);
    }, simulationConfig.intervalMs);

    return () => window.clearInterval(interval);
  }, []);

  const metrics = useMemo(() => ({
    runningBatches: batches.filter((batch) => batch.status === "Running").length,
    completedToday: batches.filter((batch) => batch.status === "Completed").length,
    qaPending: qualityChecks.filter((check) => check.status === "Pending" || check.status === "In Review").length,
    released: 18,
    rejected: 2,
    equipmentRunning: equipment.filter((item) => item.status === "Running").length,
    equipmentFault: equipment.filter((item) => item.status === "Maintenance").length,
    activeOperators: operators.filter((operator) => operator.status === "Active").length,
    oee: Number(machine.oee.toFixed(1)),
    yieldRate: Number(machine.yield.toFixed(1)),
    productionToday: 2548,
    energy: machine.energy,
    steam: machine.steam,
    water: machine.water,
  }), [batches, equipment, machine, operators, qualityChecks]);

  return {
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
    tick,
  };
}
