import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';
import { Plant, CareAlert } from '../types/plant';

interface RemindersAlertsTabProps {
  plants: Plant[];
  alerts: CareAlert[];
  onCompleteAlert: (alertId: string) => void;
  onWaterPlant: (plantId: string) => void;
  onFertilizePlant: (plantId: string) => void;
  onRepotPlant: (plantId: string) => void;
  onAddCustomAlert: (alert: Omit<CareAlert, 'id' | 'isCompleted'>) => void;
  onDeleteAlert?: (alertId: string) => void;
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
}) => {
  const [filterType, setFilterType] = useState<'all' | 'warning' | 'water' | 'fertilize' | 'repot'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

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
                        onClick={() => onWaterPlant(plant.id)}
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
                        onClick={() => onFertilizePlant(plant.id)}
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
                      onClick={() => onCompleteAlert(alert.id)}
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

      {/* Add Custom Reminder Modal */}
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
