import React, { useState } from 'react';
import { 
  Camera, 
  Plus, 
  Droplet, 
  Sun, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  TrendingUp,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Plant, HealthLog } from '../types/plant';

interface HealthTrackerTabProps {
  plants: Plant[];
  selectedPlantId: string;
  onSelectPlant: (id: string) => void;
  onOpenNewLogModal: () => void;
  onDeleteLog?: (plantId: string, logId: string) => void;
}

export const HealthTrackerTab: React.FC<HealthTrackerTabProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
  onOpenNewLogModal,
  onDeleteLog,
}) => {
  const currentPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  if (!currentPlant) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
        <p className="text-stone-500">Chưa có cây nào trong danh sách. Vui lòng tạo hồ sơ cây mới.</p>
      </div>
    );
  }

  const logs = [...(currentPlant.healthLogs || [])].reverse();
  const latestLog = logs[0];

  return (
    <div className="space-y-6">
      {/* Header Selector & Actions */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Nhật Ký & Theo Dõi
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">
                {logs.length} bản ghi sức khỏe
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title mt-1">
              Theo Dõi Sức Khỏe: {currentPlant.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Loài: {currentPlant.species} · Vị trí: {currentPlant.location}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Plant Dropdown Selector */}
            <select
              value={currentPlant.id}
              onChange={(e) => onSelectPlant(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  🌱 {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={onOpenNewLogModal}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Camera className="w-4 h-4" />
              <span>Ghi Nhật Ký Mới</span>
            </button>
          </div>
        </div>

        {/* Current State Summary Card */}
        {latestLog && (
          <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-xs text-stone-500 block">Tình trạng gần nhất</span>
              <div className="flex items-center gap-1.5 mt-1">
                {latestLog.status === 'healthy' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm font-bold text-stone-900">
                  {latestLog.condition}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-stone-500 block">Độ ẩm đất</span>
              <div className="flex items-center gap-1 mt-1 text-sm font-bold text-stone-900 tabular-nums">
                <Droplet className="w-4 h-4 text-sky-600" />
                <span>{latestLog.moisturePercent}%</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-stone-500 block">Chiều cao hiện tại</span>
              <div className="flex items-center gap-1 mt-1 text-sm font-bold text-stone-900 tabular-nums">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>{latestLog.heightCm} cm</span>
                {latestLog.newLeavesCount > 0 && (
                  <span className="text-xs font-normal text-emerald-700 ml-1">
                    (+{latestLog.newLeavesCount} lá)
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs text-stone-500 block">Ngày kiểm tra cuối</span>
              <div className="flex items-center gap-1 mt-1 text-sm font-semibold text-stone-800">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>{latestLog.date}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Health Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 font-serif-title">
            Dòng Thời Gian Thay Đổi Của Cây
          </h2>
          <span className="text-xs text-stone-500">
            Sắp xếp theo thứ tự mới nhất
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-stone-800">Chưa có nhật ký nào</h3>
            <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
              Hãy chụp ảnh và ghi nhận tình trạng đầu tiên của cây để ứng dụng theo dõi sự phát triển.
            </p>
            <button
              onClick={onOpenNewLogModal}
              className="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-medium rounded-lg hover:bg-emerald-900"
            >
              Cập nhật nhật ký đầu tiên
            </button>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-800/20 space-y-6">
            {logs.map((log, index) => {
              const isLatest = index === 0;
              const isExpanded = activeLogId === log.id || isLatest;

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                      log.status === 'healthy' ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                  />

                  {/* Log Card */}
                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-colors">
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 tabular-nums">
                            Tuần {log.weekNumber}
                          </span>
                          <span className="text-xs text-stone-500">
                            Ngày ghi nhận: {log.date}
                          </span>
                          {isLatest && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              Mới nhất
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                              log.status === 'healthy'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {log.condition}
                          </span>

                          {onDeleteLog && logs.length > 1 && (
                            <button
                              onClick={() => onDeleteLog(currentPlant.id, log.id)}
                              title="Xóa bản ghi tuần này"
                              className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                        {/* Photo Thumbnail */}
                        <div className="md:col-span-4 lg:col-span-3">
                          <div className="relative rounded-lg overflow-hidden h-44 bg-stone-100 border border-stone-200">
                            <img
                              src={log.imageUrl || currentPlant.imageUrl}
                              alt={`Tuần ${log.weekNumber}`}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('/images/monstera_deliciosa_1790162091214.jpg')) {
                                  target.src = '/images/monstera_deliciosa_1790162091214.jpg';
                                }
                              }}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] backdrop-blur-xs flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              <span>Ảnh tuần {log.weekNumber}</span>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-3">
                          {/* Metrics bar */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="p-2.5 rounded-lg bg-stone-50">
                              <span className="text-stone-500 block text-[11px]">Độ ẩm đất</span>
                              <span className="font-semibold text-stone-900 tabular-nums">
                                {log.moisturePercent}%
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-stone-50">
                              <span className="text-stone-500 block text-[11px]">Chiều cao</span>
                              <span className="font-semibold text-stone-900 tabular-nums">
                                {log.heightCm} cm
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-stone-50">
                              <span className="text-stone-500 block text-[11px]">Lá mới</span>
                              <span className="font-semibold text-emerald-700 tabular-nums">
                                +{log.newLeavesCount} lá
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-stone-50">
                              <span className="text-stone-500 block text-[11px]">Điểm sức khỏe</span>
                              <span className="font-semibold text-stone-900 tabular-nums">
                                {Math.round(
                                  (log.vitals.water +
                                    log.vitals.light +
                                    log.vitals.foliage +
                                    log.vitals.careDiscipline) /
                                    4
                                )}
                                /100
                              </span>
                            </div>
                          </div>

                          {/* Specific observations */}
                          <div className="space-y-1.5 text-xs text-stone-700">
                            <div>
                              <strong className="text-stone-900">Tình trạng lá & ngọn:</strong>{' '}
                              <span className="text-stone-600">{log.leafStatus}</span>
                            </div>
                            <div>
                              <strong className="text-stone-900">Môi trường ánh sáng:</strong>{' '}
                              <span className="text-stone-600">{log.lightStatus}</span>
                            </div>
                            {log.notes && (
                              <div className="p-2.5 bg-stone-50/80 rounded-md border border-stone-100 text-stone-600 italic">
                                "{log.notes}"
                              </div>
                            )}
                          </div>

                          {/* Symptoms tags */}
                          {log.symptoms && log.symptoms.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Triệu chứng ghi nhận:
                              </span>
                              {log.symptoms.map((sym, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-xs px-2 py-0.5 bg-amber-50 text-amber-900 rounded-md border border-amber-200"
                                >
                                  {sym}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
