import React, { useState } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  SplitSquareVertical, 
  Columns, 
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react';
import { Plant, HealthLog } from '../types/plant';

interface GrowthCompareTabProps {
  plants: Plant[];
  selectedPlantId: string;
  onSelectPlant: (id: string) => void;
  onNavigateTab?: (tab: any, plantId?: string) => void;
}

export const GrowthCompareTab: React.FC<GrowthCompareTabProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
}) => {
  const currentPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  const logs = currentPlant?.healthLogs || [];

  // Default to comparing the earliest available log (Week 1) with the latest log
  const [weekAIndex, setWeekAIndex] = useState<number>(0);
  const [weekBIndex, setWeekBIndex] = useState<number>(Math.max(0, logs.length - 1));
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  if (!currentPlant || logs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
        <h3 className="text-base font-semibold text-stone-800">Chưa đủ dữ liệu so sánh tuần</h3>
        <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
          Cần ít nhất 2 bản ghi tuần để so sánh quá trình phát triển của cây. Hãy thêm nhật ký tuần mới ở mục "Theo dõi sức khỏe".
        </p>
      </div>
    );
  }

  const logA = logs[weekAIndex] || logs[0];
  const logB = logs[weekBIndex] || logs[logs.length - 1];

  const heightDiff = (logB.heightCm || 0) - (logA.heightCm || 0);
  const newLeavesTotal = logs
    .slice(weekAIndex + 1, weekBIndex + 1)
    .reduce((sum, l) => sum + (l.newLeavesCount || 0), 0);

  // Growth evaluation
  const isHealthyGrowth = heightDiff >= 0 && (logB.symptoms?.length || 0) <= (logA.symptoms?.length || 0);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Đối Chiếu Ảnh Theo Tuần
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">
                Phát hiện sớm dấu hiệu bất thường
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title mt-1">
              So Sánh Phát Triển: {currentPlant.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              So sánh hình ảnh và số đo giữa các mốc thời gian để đánh giá tốc độ sinh trưởng.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Plant selector */}
            <select
              value={currentPlant.id}
              onChange={(e) => {
                onSelectPlant(e.target.value);
                setWeekAIndex(0);
                const nextPlant = plants.find((p) => p.id === e.target.value);
                setWeekBIndex(Math.max(0, (nextPlant?.healthLogs?.length || 1) - 1));
              }}
              className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  🌱 {p.name}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('slider')}
                title="Thanh trượt Before/After"
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kéo trượt</span>
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                title="Song song 2 cột"
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'side-by-side'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Song song</span>
              </button>
            </div>
          </div>
        </div>

        {/* Week Selector Bar */}
        <div className="mt-5 p-4 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Week A */}
          <div className="flex-1">
            <label className="text-xs font-medium text-stone-500 block mb-1">
              Mốc 1 (Trước đó):
            </label>
            <select
              value={weekAIndex}
              onChange={(e) => setWeekAIndex(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs sm:text-sm font-semibold text-stone-900"
            >
              {logs.map((log, idx) => (
                <option key={log.id} value={idx} disabled={idx === weekBIndex}>
                  Tuần {log.weekNumber} · {log.date} ({log.condition})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center text-stone-400">
            <ArrowRight className="w-5 h-5 hidden sm:block" />
            <span className="text-xs font-medium sm:hidden">So sánh với</span>
          </div>

          {/* Week B */}
          <div className="flex-1">
            <label className="text-xs font-medium text-stone-500 block mb-1">
              Mốc 2 (Sau này / Hiện tại):
            </label>
            <select
              value={weekBIndex}
              onChange={(e) => setWeekBIndex(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs sm:text-sm font-semibold text-stone-900"
            >
              {logs.map((log, idx) => (
                <option key={log.id} value={idx} disabled={idx === weekAIndex}>
                  Tuần {log.weekNumber} · {log.date} ({log.condition})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Comparison Area */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-stone-900 font-serif-title flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-emerald-700" />
            <span>Hình Ảnh Đối Chiếu: Tuần {logA.weekNumber} vs Tuần {logB.weekNumber}</span>
          </h2>
          {viewMode === 'slider' && (
            <span className="text-xs text-stone-500 hidden sm:inline">
              ← Kéo thanh trượt ở giữa để xem ảnh trước/sau →
            </span>
          )}
        </div>

        {viewMode === 'slider' ? (
          /* Interactive Split Slider */
          <div className="relative w-full h-80 sm:h-[420px] rounded-xl overflow-hidden bg-stone-900 select-none shadow-inner border border-stone-300">
            {/* After Image (Log B - Full underneath) */}
            <img
              src={logB.imageUrl || currentPlant.imageUrl}
              alt={`Tuần ${logB.weekNumber}`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('/images/monstera_deliciosa_1790162091214.jpg')) {
                  target.src = '/images/monstera_deliciosa_1790162091214.jpg';
                }
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-stone-900/80 text-white text-xs font-semibold rounded-md backdrop-blur-xs">
              Tuần {logB.weekNumber} ({logB.date})
            </div>

            {/* Before Image (Log A - Exact overlay with clip-path, zero distortion) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={logA.imageUrl || currentPlant.imageUrl}
                alt={`Tuần ${logA.weekNumber}`}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('/images/monstera_deliciosa_1790162091214.jpg')) {
                    target.src = '/images/monstera_deliciosa_1790162091214.jpg';
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-emerald-950/85 text-emerald-100 text-xs font-semibold rounded-md backdrop-blur-xs">
                Tuần {logA.weekNumber} ({logA.date})
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-stone-800 shadow-md flex items-center justify-center text-xs font-bold border border-stone-200 pointer-events-auto cursor-ew-resize">
                ↔
              </div>
            </div>

            {/* Native range slider for smooth touch & mouse interaction */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Kéo so sánh ảnh Before After"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        ) : (
          /* Side by Side Dual View */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
              <div className="p-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">Mốc trước: Tuần {logA.weekNumber}</span>
                <span className="text-stone-500">{logA.date}</span>
              </div>
              <div className="h-64 sm:h-80 relative">
                <img
                  src={logA.imageUrl || currentPlant.imageUrl}
                  alt={`Tuần ${logA.weekNumber}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
              <div className="p-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">Mốc sau: Tuần {logB.weekNumber}</span>
                <span className="text-stone-500">{logB.date}</span>
              </div>
              <div className="h-64 sm:h-80 relative">
                <img
                  src={logB.imageUrl || currentPlant.imageUrl}
                  alt={`Tuần ${logB.weekNumber}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Growth Assessment Verdict Card */}
        <div className="mt-6 p-4 sm:p-5 rounded-xl border bg-stone-50/70 border-stone-200">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isHealthyGrowth ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isHealthyGrowth ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-sm font-bold text-stone-900">
                  {isHealthyGrowth
                    ? 'Đánh giá: Cây đang phát triển rất tốt & ổn định'
                    : 'Đánh giá: Phát hiện dấu hiệu tăng trưởng chậm hoặc bất thường'}
                </h3>
                <span className="text-xs text-stone-500">
                  Khoảng cách: {Math.abs(logB.weekNumber - logA.weekNumber)} tuần
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {isHealthyGrowth
                  ? `Từ Tuần ${logA.weekNumber} đến Tuần ${logB.weekNumber}, cây đã cao thêm ${heightDiff} cm và ra thêm ${newLeavesTotal} lá mới. Tán lá xòe đều, phiến lá cứng cáp không có dấu hiệu nấm mốc nghiêm trọng.`
                  : `Chiều cao chênh lệch ${heightDiff} cm. Đã ghi nhận một số dấu hiệu cần can thiệp như vàng mép lá hoặc độ ẩm giá thể biến động. Hãy kiểm tra lại lịch tưới nước và ánh sáng.`}
              </p>

              {/* Metric Comparison Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 mt-2 border-t border-stone-200/60 text-xs">
                <div>
                  <span className="text-stone-500 block">Tăng chiều cao</span>
                  <span className="text-sm font-bold text-emerald-800 tabular-nums">
                    {heightDiff >= 0 ? `+${heightDiff}` : heightDiff} cm
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Tổng lá non mới</span>
                  <span className="text-sm font-bold text-emerald-800 tabular-nums">
                    +{newLeavesTotal} lá
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Độ ẩm đất thay đổi</span>
                  <span className="text-sm font-bold text-stone-800 tabular-nums">
                    {logA.moisturePercent}% → {logB.moisturePercent}%
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Tình trạng lá</span>
                  <span className="text-sm font-bold text-stone-800 truncate block">
                    {logB.leafStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filmstrip of all weeks */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-stone-500" />
          <span>Bộ Sưu Tập Tiến Trình Theo Tuần (Tất Cả Các Mốc)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {logs.map((log, idx) => {
            const isSelectedA = idx === weekAIndex;
            const isSelectedB = idx === weekBIndex;

            return (
              <div
                key={log.id}
                onClick={() => setWeekBIndex(idx)}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelectedB
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                    : isSelectedA
                    ? 'border-stone-400 bg-stone-100/50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="h-28 rounded-md overflow-hidden bg-stone-100 mb-2">
                  <img
                    src={log.imageUrl || currentPlant.imageUrl}
                    alt={`Tuần ${log.weekNumber}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">Tuần {log.weekNumber}</span>
                  <span className="text-[11px] text-stone-500">{log.date}</span>
                </div>
                <div className="text-[11px] text-stone-600 truncate mt-0.5">
                  {log.heightCm} cm · {log.condition}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
