export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface PlantVitalSigns {
  water: number;       // 0-100%
  light: number;       // 0-100%
  foliage: number;     // 0-100%
  careDiscipline: number; // 0-100%
}

export interface HealthLog {
  id: string;
  plantId: string;
  date: string;         // YYYY-MM-DD
  weekNumber: number;
  imageUrl: string;
  condition: 'Rất tốt' | 'Khá tốt' | 'Cần chú ý' | 'Nguy hiểm';
  status: HealthStatus;
  moisturePercent: number;
  lightStatus: string;
  leafStatus: string;
  heightCm: number;
  newLeavesCount: number;
  symptoms: string[];
  notes: string;
  vitals: PlantVitalSigns;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  startDate: string;     // Ngày bắt đầu chăm sóc
  location: string;      // Vị trí đặt cây (e.g., Ban công, Bàn làm việc,...)
  characteristics: string; // Đặc điểm của cây (e.g., Cần bóng râm nhẹ, thích đất tơi xốp,...)
  sunlight: 'Ít ánh sáng' | 'Ánh sáng gián tiếp' | 'Ánh sáng trực tiếp' | 'Nắng bán phần';
  potSize: string;       // Kích thước chậu
  soilType: string;      // Loại giá thể
  imageUrl: string;
  healthScore: number;   // 0-100
  status: HealthStatus;
  lastWatered: string;
  waterCycleDays: number;
  lastFertilized: string;
  fertilizeCycleDays: number;
  lastRepotted: string;
  repotCycleMonths: number;
  healthLogs: HealthLog[];
  customPlan?: any;
}

export interface CareAlert {
  id: string;
  plantId: string;
  plantName: string;
  type: 'water' | 'fertilize' | 'repot' | 'warning';
  title: string;
  description: string;
  dueDate: string;
  urgency: 'low' | 'medium' | 'high';
  isCompleted: boolean;
}

export type ActiveTab = 
  | 'profiles' 
  | 'health-tracker' 
  | 'growth-compare' 
  | 'health-index' 
  | 'reminders' 
  | 'care-plan' 
  | 'ai-doctor';
