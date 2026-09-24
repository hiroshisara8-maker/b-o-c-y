import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Droplet, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Check, 
  Calendar,
  AlertOctagon,
  Trash2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  Bell
} from 'lucide-react';
import { Plant, CareAlert } from '../types/plant';
import { 
  playZenBell, 
  playWaterDrop, 
  playMorningMelody, 
  playReminderAlarm, 
  playSoundByTone,
  SoundTone 
} from '../utils/audio';

interface RemindersAlertsTabProps {
  plants: Plant[];
  alerts: CareAlert[];
  onCompleteAlert: (alertId: string) => void;
  onWaterPlant: (plantId: string) => void;
  onFertilizePlant: (plantId: string) => void;
  onRepotPlant: (plantId: string) => void;
  onAddCustomAlert: (alert: Omit<CareAlert, 'id' | 'isCompleted'>) => void;
  onDeleteAlert?: (alertId: string) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const RemindersAlertsTab: React.FC<RemindersAlertsTabProps> = ({
  plants,
  alerts,
  onCompleteAlert,
  onWaterPlant,
  onFertilizePlant,
  onRepotPlant,
  onAddCustomAlert,
  onDeleteAlert,
  soundEnabled = true,
  onToggleSound,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'warning' | 'water' | 'fertilize' | 'repot'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Audio Reminder Tone & Care Timer states
  const [selectedTone, setSelectedTone] = useState<SoundTone>('bell');
  const [timerDurationMinutes, setTimerDurationMinutes] = useState<number>(15);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerTaskLabel, setTimerTaskLabel] = useState<string>('Ngâm đáy chậu hút nước');
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState<boolean>(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('');

  // Countdown Timer Hook
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            setIsAlarmModalOpen(true);
            playReminderAlarm(selectedTone);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft, selectedTone]);

  const handleStartTimer = () => {
    if (timerSecondsLeft === 0) {
      setTimerSecondsLeft(timerDurationMinutes * 60);
    }
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerDurationMinutes * 60);
  };

  const handleSelectPreset = (minutes: number, label: string) => {
    setTimerDurationMinutes(minutes);
    setTimerSecondsLeft(minutes * 60);
    setIsTimerRunning(false);
    setTimerTaskLabel(label);
  };

  const handleSetCustomMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customMinutesInput, 10);
    if (!isNaN(num) && num > 0 && num <= 360) {
      setTimerDurationMinutes(num);
      setTimerSecondsLeft(num * 60);
      setIsTimerRunning(false);
      setTimerTaskLabel(`Hẹn giờ chăm sóc (${num} phút)`);
      setCustomMinutesInput('');
    }
  };

  const handleTestTone = (tone: SoundTone) => {
    setSelectedTone(tone);
    playSoundByTone(tone);
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerProgressPercent = Math.max(
    0,
    Math.min(
      100,
      ((timerDurationMinutes * 60 - timerSecondsLeft) / (timerDurationMinutes * 60)) * 100
    )
  );

  // Form states for new reminder
  const [newPlantId, setNewPlantId] = useState(plants[0]?.id || '');
  const [newType, setNewType] = useState<'water' | 'fertilize' | 'repot' | 'warning'>('water');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('Ngày mai');
  const [newUrgency, setNewUrgency] = useState<'low' | 'medium' | 'high'>('medium');

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  const pendingAlerts = filteredAlerts.filter((a) => !a.isCompleted);
  const completedAlerts = filteredAlerts.filter((a) => a.isCompleted);

  // Calculate upcoming watering countdowns for all plants
  const plantReminders = plants.map((plant) => {
    const daysSinceWatered = Math.floor(
      (Date.now() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
    );
    const waterDaysLeft = plant.waterCycleDays - daysSinceWatered;

    const daysSinceFertilized = Math.floor(
      (Date.now() - new Date(plant.lastFertilized).getTime()) / (1000 * 60 * 60 * 24)
    );
    const fertilizeDaysLeft = plant.fertilizeCycleDays - daysSinceFertilized;

    return {
      plant,
      waterDaysLeft,
      fertilizeDaysLeft,
      daysSinceWatered,
    };
  });

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPlant = plants.find((p) => p.id === newPlantId);
    if (!targetPlant || !newTitle.trim()) return;

    onAddCustomAlert({
      plantId: targetPlant.id,
      plantName: targetPlant.name,
      type: newType,
      title: newTitle,
      description: newDescription || `Nhắc nhở tự đặt cho ${targetPlant.name}`,
      dueDate: newDueDate,
      urgency: newUrgency,
    });

    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Overview */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Hệ Thống Cảnh Báo & Lịch Chăm Sóc
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">
                {pendingAlerts.length} việc cần làm
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title mt-1">
              Cảnh Báo & Nhắc Nhở Định Kỳ
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Tự động tính toán chu kỳ tưới nước, bón phân, thay đất và cảnh báo sớm nguy cơ bệnh.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Lời Nhắc Mới</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-5 mt-5 border-t border-stone-100">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Tất cả ({alerts.length})
          </button>
          <button
            onClick={() => setFilterType('warning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'warning'
                ? 'bg-rose-800 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cảnh báo khẩn ({alerts.filter((a) => a.type === 'warning').length})</span>
          </button>
          <button
            onClick={() => setFilterType('water')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'water'
                ? 'bg-sky-800 text-white'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Lịch tưới ({alerts.filter((a) => a.type === 'water').length})</span>
          </button>
          <button
            onClick={() => setFilterType('fertilize')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'fertilize'
                ? 'bg-purple-800 text-white'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bón phân ({alerts.filter((a) => a.type === 'fertilize').length})</span>
          </button>
          <button
            onClick={() => setFilterType('repot')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'repot'
                ? 'bg-amber-800 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thay đất / Chậu ({alerts.filter((a) => a.type === 'repot').length})</span>
          </button>
        </div>
      </div>

      {/* NEW: Care Timer & Audio Reminder Sound System */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-emerald-700" />
                Hẹn Giờ Chăm Sóc & Chuông Nhắc Nhở
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">
                Âm thanh chuông báo thời gian
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif-title mt-1">
              Đồng Hồ Hẹn Giờ Chăm Cây Theo Phiên
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Hẹn giờ cho các tác vụ cần thời gian chính xác: ngâm ráo đáy chậu, phơi nắng sáng, thấm phân bón lá.
            </p>
          </div>

          {/* Master Sound Toggle */}
          <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-700 px-1">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
              <span>Âm thanh nhắc nhở:</span>
              <span className={soundEnabled ? 'text-emerald-700 font-bold' : 'text-stone-500'}>
                {soundEnabled ? 'BẬT' : 'TẮT'}
              </span>
            </div>
            {onToggleSound && (
              <button
                type="button"
                onClick={onToggleSound}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {soundEnabled ? 'Tắt âm' : 'Bật âm'}
              </button>
            )}
          </div>
        </div>

        {/* Timer Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          {/* Left Column: Timer Dial & Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Active task label */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Nhiệm vụ đang hẹn:
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {timerTaskLabel}
              </span>
            </div>

            {/* Countdown Clock Display & Progress Bar */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 text-white shadow-inner flex flex-col items-center justify-center text-center relative overflow-hidden">
              <span className="text-4xl sm:text-6xl font-extrabold font-mono tracking-wider tabular-nums">
                {formatTimer(timerSecondsLeft)}
              </span>

              <span className="text-xs text-stone-400 mt-1">
                {isTimerRunning
                  ? '⏳ Đang đếm ngược thời gian chăm sóc...'
                  : timerSecondsLeft === 0
                  ? '⏰ Đã hoàn thành phiên chăm sóc!'
                  : `Tổng thời gian đặt: ${timerDurationMinutes} phút`}
              </span>

              {/* Progress Track */}
              <div className="w-full bg-stone-800 rounded-full h-2 mt-4 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${timerProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3">
              {!isTimerRunning ? (
                <button
                  type="button"
                  onClick={handleStartTimer}
                  className="flex-1 max-w-[200px] py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{timerSecondsLeft === 0 ? 'Bắt đầu lại' : 'Bắt đầu đếm'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePauseTimer}
                  className="flex-1 max-w-[200px] py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Tạm dừng</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetTimer}
                title="Đặt lại đồng hồ"
                className="py-2.5 px-4 border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Đặt lại</span>
              </button>
            </div>
          </div>

          {/* Right Column: Presets & Sound Tone Options */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 lg:pl-4 lg:border-l lg:border-stone-100">
            {/* Quick Presets */}
            <div>
              <span className="text-xs font-bold text-stone-800 block mb-2">
                ⏱️ Mốc thời gian chăm sóc thông dụng:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectPreset(15, 'Ngâm đáy chậu hút nước (15p)')}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    timerDurationMinutes === 15 && timerTaskLabel.includes('15')
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-bold block">15 phút</span>
                  <span className="text-[11px] text-stone-500">Ngâm hút nước đáy</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset(30, 'Phơi nắng sáng dịu (30p)')}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    timerDurationMinutes === 30 && timerTaskLabel.includes('30')
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-bold block">30 phút</span>
                  <span className="text-[11px] text-stone-500">Phơi nắng ban mai</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset(45, 'Thoát nước & kiểm tra đĩa lót (45p)')}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    timerDurationMinutes === 45 && timerTaskLabel.includes('45')
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-bold block">45 phút</span>
                  <span className="text-[11px] text-stone-500">Đổ nước đĩa đáy</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset(60, 'Thấm khô dưỡng chất phun lá (60p)')}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    timerDurationMinutes === 60 && timerTaskLabel.includes('60')
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-bold block">60 phút</span>
                  <span className="text-[11px] text-stone-500">Hấp thụ phun lá</span>
                </button>
              </div>

              {/* Custom Minutes Input */}
              <form onSubmit={handleSetCustomMinutes} className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="360"
                  placeholder="Tùy chỉnh số phút..."
                  value={customMinutesInput}
                  onChange={(e) => setCustomMinutesInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-900 cursor-pointer"
                >
                  Áp dụng
                </button>
              </form>
            </div>

            {/* Sound Tone Picker & Audio Test */}
            <div className="pt-3 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-800 block mb-2 flex items-center justify-between">
                <span>🎵 Kiểu âm thanh chuông báo:</span>
                <span className="text-[11px] text-stone-400 font-normal">Bấm để nghe thử</span>
              </span>

              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleTestTone('bell')}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                    selectedTone === 'bell'
                      ? 'bg-emerald-100/70 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[11px] text-center">Chuông Thiền</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTestTone('water')}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                    selectedTone === 'water'
                      ? 'bg-sky-100/70 border-sky-500 text-sky-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-[11px] text-center">Giọt Nước</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTestTone('melody')}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                    selectedTone === 'melody'
                      ? 'bg-purple-100/70 border-purple-500 text-purple-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Music className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-[11px] text-center">Ban Mai</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routine Quick Actions Card (Plant Water & Feed Status) */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 font-serif-title mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-800" />
          <span>Theo Dõi Chu Kỳ Chăm Sóc Trực Quan Các Cây</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plantReminders.map(({ plant, waterDaysLeft, fertilizeDaysLeft }) => {
            const isDueWater = waterDaysLeft <= 0;
            const isDueFertilize = fertilizeDaysLeft <= 0;

            return (
              <div
                key={plant.id}
                className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/60 hover:bg-stone-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900">
                      🌱 {plant.name}
                    </h3>
                    <span className="text-xs text-stone-500 truncate max-w-[130px]">
                      {plant.location}
                    </span>
                  </div>

                  {/* Water Status */}
                  <div className="mt-3 flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-sky-600" />
                      <div>
                        <span className="font-semibold text-stone-800 block">Tưới nước:</span>
                        <span className="text-stone-500 text-[11px]">
                          Lần cuối: {plant.lastWatered}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold tabular-nums text-xs px-2 py-0.5 rounded ${
                          isDueWater
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-sky-50 text-sky-800'
                        }`}
                      >
                        {isDueWater ? 'Đến hạn tưới!' : `Còn ${waterDaysLeft} ngày`}
                      </span>
                      <button
                        onClick={() => {
                          playWaterDrop();
                          onWaterPlant(plant.id);
                        }}
                        title="Đã tưới nước ngay hôm nay"
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-md cursor-pointer transition-colors active:scale-95"
                      >
                        Đã tưới
                      </button>
                    </div>
                  </div>

                  {/* Fertilizer Status */}
                  <div className="mt-2 flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-semibold text-stone-800 block">Dinh dưỡng:</span>
                        <span className="text-stone-500 text-[11px]">
                          Chu kỳ {plant.fertilizeCycleDays} ngày
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold tabular-nums text-xs px-2 py-0.5 rounded ${
                          isDueFertilize
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-50 text-purple-800'
                        }`}
                      >
                        {isDueFertilize ? 'Cần bón phân' : `Còn ${fertilizeDaysLeft} ngày`}
                      </span>
                      <button
                        onClick={() => {
                          playMorningMelody();
                          onFertilizePlant(plant.id);
                        }}
                        title="Đã bón phân hôm nay"
                        className="px-2.5 py-1 text-xs font-semibold bg-stone-700 hover:bg-stone-900 text-white rounded-md cursor-pointer transition-colors active:scale-95"
                      >
                        Đã bón
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-stone-900 font-serif-title flex items-center justify-between">
          <span>Danh Sách Cảnh Báo & Việc Cần Chú Ý ({pendingAlerts.length})</span>
          <span className="text-xs font-normal text-stone-500">
            Bấm "Đã xong" sau khi xử lý để cập nhật lịch sử
          </span>
        </h2>

        {pendingAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-stone-900">
              Tuyệt vời! Không có cảnh báo tồn đọng
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Tất cả cây trồng đều đang được chăm sóc đúng theo kế hoạch sinh học.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingAlerts.map((alert) => {
              const isWarning = alert.type === 'warning';

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isWarning
                      ? 'bg-rose-50/70 border-rose-200'
                      : alert.type === 'water'
                      ? 'bg-sky-50/60 border-sky-200'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isWarning
                          ? 'bg-rose-100 text-rose-700'
                          : alert.type === 'water'
                          ? 'bg-sky-100 text-sky-700'
                          : alert.type === 'fertilize'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isWarning ? (
                        <AlertOctagon className="w-5 h-5" />
                      ) : alert.type === 'water' ? (
                        <Droplet className="w-5 h-5" />
                      ) : alert.type === 'fertilize' ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <RefreshCw className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {alert.plantName}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            alert.urgency === 'high'
                              ? 'bg-rose-200 text-rose-900'
                              : alert.urgency === 'medium'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          Hạn: {alert.dueDate}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-stone-900 mt-1">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-2xl">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        playZenBell();
                        onCompleteAlert(alert.id);
                      }}
                      className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      <Check className="w-4 h-4" />
                      <span>Đã xử lý xong</span>
                    </button>
                    {onDeleteAlert && (
                      <button
                        onClick={() => onDeleteAlert(alert.id)}
                        title="Xóa lời nhắc này"
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completed list accordion */}
        {completedAlerts.length > 0 && (
          <div className="pt-4 border-t border-stone-200">
            <span className="text-xs font-medium text-stone-500 mb-2 block">
              Đã hoàn thành gần đây ({completedAlerts.length})
            </span>
            <div className="space-y-2 opacity-75">
              {completedAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-stone-100/80 border border-stone-200 text-xs flex items-center justify-between text-stone-500"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="line-through">{alert.title}</span>
                    <span className="text-stone-400">({alert.plantName})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Đã ghi nhận</span>
                    {onDeleteAlert && (
                      <button
                        onClick={() => onDeleteAlert(alert.id)}
                        title="Xóa bản ghi này"
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alarm Finished Notification Modal */}
      {isAlarmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <BellRing className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-serif-title">
              Đã Hết Giờ Chăm Sóc!
            </h3>

            <p className="text-sm font-semibold text-emerald-800 mt-2 bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-200">
              {timerTaskLabel}
            </p>

            <p className="text-xs text-stone-600 mt-2">
              Thời gian hẹn đã kết thúc. Hãy kiểm tra lại tình trạng cây trồng và hoàn tất công việc nhé!
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsAlarmModalOpen(false);
                  handleSelectPreset(5, 'Hẹn thêm 5 phút kiểm tra');
                  handleStartTimer();
                }}
                className="px-4 py-2.5 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-100 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                +5 phút nữa
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAlarmModalOpen(false);
                  handleResetTimer();
                }}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                Đã xong, tắt chuông
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <h2 className="text-lg font-bold text-stone-900 font-serif-title">
              Tạo Lời Nhắc / Cảnh Báo Cho Cây
            </h2>

            <form onSubmit={handleCreateReminder} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Chọn cây áp dụng:
                </label>
                <select
                  value={newPlantId}
                  onChange={(e) => setNewPlantId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800"
                >
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Loại việc:
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800"
                  >
                    <option value="water">Tưới nước</option>
                    <option value="fertilize">Bón phân</option>
                    <option value="repot">Thay đất / chậu</option>
                    <option value="warning">Cảnh báo sâu bệnh</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Mức độ cấp bách:
                  </label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-800"
                  >
                    <option value="low">Bình thường</option>
                    <option value="medium">Quan trọng</option>
                    <option value="high">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Tiêu đề nhắc nhở:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kiểm tra mặt dưới lá xem có rệp sáp..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-800 focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Chi tiết hướng dẫn xử lý:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú hướng dẫn cụ thể..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-800 focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Thời hạn thực hiện:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hôm nay, Ngày mai, 3 ngày tới..."
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900"
                >
                  Lưu lời nhắc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
