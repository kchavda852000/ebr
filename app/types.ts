export interface Batch {
  id: string;
  batchNumber: string;
  product: string;
  recipe: string;
  status: string;
  progress: number;
  startedAt: string;
  expectedCompletion: string;
  operator: string;
  supervisor: string;
  qa: string;
  materialConsumption: number;
  equipment: string[];
  currentStep: string;
  shift: string;
}

export interface Recipe {
  id: string;
  name: string;
  version: string;
  approvalState: string;
  steps: string[];
  criticalParameters: string[];
  equipment: string[];
  materials: string[];
  attachments: string[];
  approvalHistory: string[];
}

export interface Material {
  name: string;
  lot: string;
  stock: number;
  consumption: number;
  expiry: string;
  supplier: string;
  status: string;
}

export interface Equipment {
  id: string;
  name: string;
  status: string;
  availability: number;
  performance: number;
  runtime: number;
  downtime: number;
  oee: number;
  health: number;
  maintenanceDue: string;
  calibration: string;
}

export interface Operator {
  name: string;
  shift: string;
  status: string;
  batch: string;
  training: string;
  performance: number;
  activity: string;
}

export interface Alarm {
  id: string;
  severity: string;
  equipment: string;
  message: string;
  acknowledged: boolean;
}

export interface Deviation {
  id: string;
  title: string;
  severity: string;
  status: string;
  batch: string;
}

export interface AuditEntry {
  time: string;
  user: string;
  module: string;
  action: string;
  oldValue: string;
  newValue: string;
  reason: string;
  ip: string;
}

export interface MachineSnapshot {
  temperature: number;
  pressure: number;
  humidity: number;
  rpm: number;
  tankLevel: number;
  weight: number;
  batchProgress: number;
  remainingTime: number;
  machineStatus: string;
  operatorStatus: string;
  currentRecipeStep: string;
  currentShift: string;
  alarmCount: number;
  oee: number;
  yield: number;
  energy: number;
  water: number;
  steam: number;
}

export interface QualityCheck {
  id: string;
  name: string;
  status: string;
  result: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  tone: string;
}

export interface ApprovalRecord {
  id: string;
  stage: string;
  approver: string;
  status: string;
  time: string;
}
