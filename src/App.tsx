import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlantProfileTab } from './components/PlantProfileTab';
import { HealthTrackerTab } from './components/HealthTrackerTab';
import { GrowthCompareTab } from './components/GrowthCompareTab';
import { HealthIndexTab } from './components/HealthIndexTab';
import { RemindersAlertsTab } from './components/RemindersAlertsTab';
import { AICarePlanTab } from './components/AICarePlanTab';
import { AIDoctorTab } from './components/AIDoctorTab';
import { AddPlantModal } from './components/AddPlantModal';
import { NewLogModal } from './components/NewLogModal';
import { Plant, CareAlert, ActiveTab, HealthLog } from './types/plant';
import { SEED_PLANTS, INITIAL_ALERTS } from './data/seedPlants';
import { CheckCircle2, Info, Sprout } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playZenBell } from './utils/audio';

const STORAGE_KEY_PLANTS = 'cuucay_plants_v1';
const STORAGE_KEY_ALERTS = 'cuucay_alerts_v1';

export default function App() {
  // Load plants from localStorage or initial seed
  const [plants, setPlants] = useState<Plant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize any legacy image paths from /src/assets/images/ to /images/
          return parsed.map((p: Plant) => ({
            ...p,
            imageUrl: p.imageUrl
              ? p.imageUrl.replace('/src/assets/images/', '/images/')
              : '/images/monstera_deliciosa_1790162091214.jpg',
            healthLogs: (p.healthLogs || []).map((log) => ({
              ...log,
              imageUrl: log.imageUrl
                ? log.imageUrl.replace('/src/assets/images/', '/images/')
                : '/images/monstera_deliciosa_1790162091214.jpg',
            })),
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load plants from localStorage:', e);
    }
    return SEED_PLANTS;
  });

  // Load alerts from localStorage or initial seed
  const [alerts, setAlerts] = useState<CareAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load alerts from localStorage:', e);
    }
    return INITIAL_ALERTS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('profiles');
  const [selectedPlantId, setSelectedPlantId] = useState<string>(() => plants[0]?.id || 'plant-1');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [isNewLogModalOpen, setIsNewLogModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sound Notification state
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    setSoundEnabled(next);
    if (next) {
      playZenBell();
      showToast('Đã bật âm thanh chuông nhắc nhở! 🔔');
    } else {
      showToast('Đã tắt âm thanh nhắc nhở.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLANTS, JSON.stringify(plants));
    } catch (e) {
      console.error('Failed to save plants to localStorage:', e);
    }
  }, [plants]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.error('Failed to save alerts to localStorage:', e);
    }
  }, [alerts]);

  const currentPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  // Plant CRUD
  const handleSavePlant = (plantData: Partial<Plant>) => {
    if (editingPlant) {
      setPlants((prev) =>
        prev.map((p) => (p.id === editingPlant.id ? { ...p, ...plantData } : p))
      );
      showToast(`Đã cập nhật hồ sơ cây "${plantData.name || editingPlant.name}"!`);
      setEditingPlant(null);
    } else {
      const newPlant: Plant = {
        id: `plant-${Date.now()}`,
        name: plantData.name || 'Cây mới',
        species: plantData.species || 'Chưa phân loại',
        startDate: plantData.startDate || new Date().toISOString().split('T')[0],
        location: plantData.location || 'Trong nhà',
        characteristics: plantData.characteristics || 'Cây trồng gia đình',
        sunlight: plantData.sunlight || 'Ánh sáng gián tiếp',
        potSize: plantData.potSize || 'Chậu Ø 20cm',
        soilType: plantData.soilType || 'Đất hữu cơ',
        imageUrl: plantData.imageUrl || '/images/monstera_deliciosa_1790162091214.jpg',
        healthScore: 90,
        status: 'healthy',
        lastWatered: new Date().toISOString().split('T')[0],
        waterCycleDays: plantData.waterCycleDays || 4,
        lastFertilized: new Date().toISOString().split('T')[0],
        fertilizeCycleDays: plantData.fertilizeCycleDays || 20,
        lastRepotted: plantData.startDate || new Date().toISOString().split('T')[0],
        repotCycleMonths: 12,
        healthLogs: [
          {
            id: `log-${Date.now()}`,
            plantId: `plant-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            weekNumber: 1,
            imageUrl: plantData.imageUrl || '/images/monstera_deliciosa_1790162091214.jpg',
            condition: 'Rất tốt',
            status: 'healthy',
            moisturePercent: 60,
            lightStatus: 'Tốt',
            leafStatus: 'Cây mới trồng, lá tươi tỉnh',
            heightCm: 35,
            newLeavesCount: 0,
            symptoms: [],
            notes: 'Bắt đầu chăm sóc cây tại vị trí mới.',
            vitals: { water: 90, light: 90, foliage: 90, careDiscipline: 95 },
          },
        ],
      };

      setPlants((prev) => [newPlant, ...prev]);
      setSelectedPlantId(newPlant.id);
      showToast(`Đã tạo thành công hồ sơ cho "${newPlant.name}"!`);
    }
  };

  const handleDeletePlant = (id: string) => {
    setPlants((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (selectedPlantId === id) {
        setSelectedPlantId(filtered.length > 0 ? filtered[0].id : '');
      }
      return filtered;
    });
    setAlerts((prev) => prev.filter((a) => a.plantId !== id));
    showToast('Đã xóa hồ sơ cây thành công.');
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showToast('Đã xóa lời nhắc thành công.');
  };

  const handleDeleteHealthLog = (plantId: string, logId: string) => {
    setPlants((prev) =>
      prev.map((plant) => {
        if (plant.id === plantId) {
          const updatedLogs = (plant.healthLogs || []).filter((l) => l.id !== logId);
          const latestLog = updatedLogs[updatedLogs.length - 1];
          return {
            ...plant,
            healthScore: latestLog
              ? Math.round(
                  (latestLog.vitals.water +
                    latestLog.vitals.light +
                    latestLog.vitals.foliage +
                    latestLog.vitals.careDiscipline) /
                    4
                )
              : plant.healthScore,
            status: latestLog ? latestLog.status : plant.status,
            healthLogs: updatedLogs,
          };
        }
        return plant;
      })
    );
    showToast('Đã xóa bản ghi nhật ký sức khỏe.');
  };

  // Health Log Save
  const handleSaveHealthLog = (newLog: HealthLog) => {
    setPlants((prev) =>
      prev.map((plant) => {
        if (plant.id === newLog.plantId) {
          const updatedLogs = [...(plant.healthLogs || []), newLog];
          return {
            ...plant,
            healthScore: Math.round(
              (newLog.vitals.water +
                newLog.vitals.light +
                newLog.vitals.foliage +
                newLog.vitals.careDiscipline) /
                4
            ),
            status: newLog.status,
            healthLogs: updatedLogs,
          };
        }
        return plant;
      })
    );
    showToast(`Đã ghi nhận nhật ký sức khỏe Tuần ${newLog.weekNumber}!`);
  };

  // Routine Quick Actions
  const handleWaterPlant = (plantId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, lastWatered: today } : p))
    );
    // Complete any pending water alert for this plant
    setAlerts((prev) =>
      prev.map((a) =>
        a.plantId === plantId && a.type === 'water' ? { ...a, isCompleted: true } : a
      )
    );
    const target = plants.find((p) => p.id === plantId);
    showToast(`Đã ghi nhận tưới nước cho cây "${target?.name || ''}"! 💧`);
  };

  const handleFertilizePlant = (plantId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, lastFertilized: today } : p))
    );
    setAlerts((prev) =>
      prev.map((a) =>
        a.plantId === plantId && a.type === 'fertilize' ? { ...a, isCompleted: true } : a
      )
    );
    const target = plants.find((p) => p.id === plantId);
    showToast(`Đã bón phân dinh dưỡng cho "${target?.name || ''}"! 🌿`);
  };

  const handleRepotPlant = (plantId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, lastRepotted: today } : p))
    );
    setAlerts((prev) =>
      prev.map((a) =>
        a.plantId === plantId && a.type === 'repot' ? { ...a, isCompleted: true } : a
      )
    );
    showToast('Đã ghi nhận thay đất / chuyển chậu cho cây!');
  };

  const handleCompleteAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isCompleted: true } : a))
    );
    showToast('Đã hoàn thành và lưu vào lịch sử chăm sóc!');
  };

  const handleAddCustomAlert = (newAlertData: Omit<CareAlert, 'id' | 'isCompleted'>) => {
    const newAlert: CareAlert = {
      ...newAlertData,
      id: `alert-${Date.now()}`,
      isCompleted: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast('Đã thêm lời nhắc mới vào danh sách!');
  };

  const handleUpdatePlantPlan = (plantId: string, customPlan: any) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, customPlan } : p))
    );
    showToast('Đã cập nhật kế hoạch chăm sóc AI mới cho cây!');
  };

  const pendingAlertsCount = alerts.filter((a) => !a.isCompleted).length;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-950">
      <div>
        {/* Overhead Header + Function Slide Bar */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingAlertsCount={pendingAlertsCount}
          onOpenAddModal={() => {
            setEditingPlant(null);
            setIsAddModalOpen(true);
          }}
          plantCount={plants.length}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        {/* Main View Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'profiles' && (
            <PlantProfileTab
              plants={plants}
              selectedPlantId={selectedPlantId}
              onSelectPlant={setSelectedPlantId}
              onOpenAddModal={() => {
                setEditingPlant(null);
                setIsAddModalOpen(true);
              }}
              onOpenEditModal={(plant) => {
                setEditingPlant(plant);
                setIsAddModalOpen(true);
              }}
              onDeletePlant={handleDeletePlant}
              onNavigateTab={(tab, plantId) => {
                if (plantId) setSelectedPlantId(plantId);
                setActiveTab(tab);
              }}
            />
          )}

          {activeTab === 'health-tracker' && (
            <HealthTrackerTab
              plants={plants}
              selectedPlantId={selectedPlantId}
              onSelectPlant={setSelectedPlantId}
              onOpenNewLogModal={() => setIsNewLogModalOpen(true)}
              onDeleteLog={handleDeleteHealthLog}
              onOpenDoctorTab={() => setActiveTab('ai-doctor')}
            />
          )}

          {activeTab === 'growth-compare' && (
            <GrowthCompareTab
              plants={plants}
              selectedPlantId={selectedPlantId}
              onSelectPlant={setSelectedPlantId}
            />
          )}

          {activeTab === 'health-index' && (
            <HealthIndexTab
              plants={plants}
              selectedPlantId={selectedPlantId}
              onSelectPlant={setSelectedPlantId}
              onNavigateTab={(tab, plantId) => {
                if (plantId) setSelectedPlantId(plantId);
                setActiveTab(tab);
              }}
            />
          )}

          {activeTab === 'reminders' && (
            <RemindersAlertsTab
              plants={plants}
              alerts={alerts}
              onCompleteAlert={handleCompleteAlert}
              onWaterPlant={handleWaterPlant}
              onFertilizePlant={handleFertilizePlant}
              onRepotPlant={handleRepotPlant}
              onAddCustomAlert={handleAddCustomAlert}
              onDeleteAlert={handleDeleteAlert}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {activeTab === 'care-plan' && (
            <AICarePlanTab
              plants={plants}
              selectedPlantId={selectedPlantId}
              onSelectPlant={setSelectedPlantId}
              onUpdatePlantPlan={handleUpdatePlantPlan}
            />
          )}

          {activeTab === 'ai-doctor' && (
            <AIDoctorTab
              plants={plants}
              selectedPlantId={selectedPlantId}
              onSelectPlant={setSelectedPlantId}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/70 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold text-stone-800">Cứu Cây</span>
            <span>· Nền tảng theo dõi và cứu hộ cây trồng thông minh</span>
          </div>
          <div>
            <span>Đồng hành cùng người yêu cây tại nhà, học sinh và sinh viên</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs sm:text-sm animate-fade-in border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add / Edit Plant Profile Modal */}
      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPlant(null);
        }}
        onSave={handleSavePlant}
        editingPlant={editingPlant}
      />

      {/* New Health Log Modal */}
      {currentPlant && (
        <NewLogModal
          isOpen={isNewLogModalOpen}
          onClose={() => setIsNewLogModalOpen(false)}
          plant={currentPlant}
          onSaveLog={handleSaveHealthLog}
        />
      )}
    </div>
  );
}
