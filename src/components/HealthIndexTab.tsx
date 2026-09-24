import React from 'react';
import { 
  Droplet, 
  Sun, 
  Leaf, 
  HeartPulse, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Plant, ActiveTab } from '../types/plant';

interface HealthIndexTabProps {
  plants: Plant[];
  selectedPlantId: string;
  onSelectPlant: (id: string) => void;
  onNavigateTab: (tab: ActiveTab, plantId?: string) => void;
}

export const HealthIndexTab: React.FC<HealthIndexTabProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
  onNavigateTab,
}) => {
  const currentPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  if (!currentPlant) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
        <p className="text-stone-500">Chưa có cây nào trong danh mục.</p>
      </div>
    );
  }

  const logs = currentPlant.healthLogs || [];
  const latestLog = logs[logs.length - 1];

  // Calculated vitals
  const vitals = latestLog?.vitals || {
    water: currentPlant.healthScore > 80 ? 88 : 65,
    light: currentPlant.healthScore > 80 ? 90 : 70,
    foliage: currentPlant.healthScore > 80 ? 86 : 60,
    careDiscipline: currentPlant.healthScore > 80 ? 92 : 75,
  };

  const overallScore = Math.round(
    (vitals.water + vitals.light + vitals.foliage + vitals.careDiscipline) / 4
  );

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-600';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Bảng Theo Dõi Chỉ Số Sức Khỏe
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">
                Tổng hợp 4 chỉ số sinh học trọng yếu
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title mt-1">
              Chỉ Số Sức Khỏe: {currentPlant.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Đánh giá tổng hợp tình trạng Nước, Ánh sáng, Sức khỏe Lá và Mức độ Kỷ luật Chăm sóc.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
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
          </div>
        </div>

        {/* Overall Health Score Card */}
        <div className="mt-6 p-5 rounded-xl bg-stone-50/80 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-white shadow-xs border-4 border-emerald-600/30">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
                  {overallScore}
                </span>
                <span className="text-[10px] text-stone-500 block -mt-1 font-medium">/ 100</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-stone-500 font-medium block">Đánh giá chung</span>
              <h3 className="text-lg font-bold text-stone-900 font-serif-title mt-0.5">
                {overallScore >= 85
                  ? 'Trạng thái rất lý tưởng & sung sức'
                  : overallScore >= 70
                  ? 'Trạng thái ổn định, cần duy trì chăm sóc'
                  : 'Cây đang chịu căng thẳng sinh học, cần sơ cứu'}
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-md">
                Dựa trên phân tích hình ảnh và nhật ký tưới bón gần nhất. Cây có sức sống{' '}
                {overallScore >= 80 ? 'rất tích cực' : 'cần cải thiện nguồn nước/ánh sáng'}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('care-plan', currentPlant.id)}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Xem lộ trình tối ưu</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai-doctor', currentPlant.id)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Hỏi Bác Sĩ AI</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* The 4 Core Vital Signs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vital 1: Nước */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border tabular-nums ${getScoreColor(vitals.water)}`}>
                {vitals.water}%
              </span>
            </div>

            <h3 className="text-base font-bold text-stone-900 mt-3">Chỉ Số Nước & Ẩm</h3>
            <p className="text-xs text-stone-500 mt-1">
              Độ ẩm giá thể & chu kỳ thoát nước
            </p>

            <div className="mt-3 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(vitals.water)}`}
                style={{ width: `${vitals.water}%` }}
              />
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Chu kỳ:</span>
                <span className="font-semibold text-stone-800">{currentPlant.waterCycleDays} ngày/lần</span>
              </div>
              <div className="flex justify-between">
                <span>Độ ẩm đo gần nhất:</span>
                <span className="font-semibold text-stone-800">{latestLog?.moisturePercent || 60}%</span>
              </div>
              <div className="flex justify-between">
                <span>Nguy cơ ngập úng:</span>
                <span className="font-semibold text-emerald-700">Rất thấp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vital 2: Ánh sáng */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border tabular-nums ${getScoreColor(vitals.light)}`}>
                {vitals.light}%
              </span>
            </div>

            <h3 className="text-base font-bold text-stone-900 mt-3">Chỉ Số Ánh Sáng</h3>
            <p className="text-xs text-stone-500 mt-1">
              Cường độ quang hợp & vị trí nhận sáng
            </p>

            <div className="mt-3 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(vitals.light)}`}
                style={{ width: `${vitals.light}%` }}
              />
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Chế độ sáng:</span>
                <span className="font-semibold text-stone-800 truncate ml-2">{currentPlant.sunlight}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời lượng ước tính:</span>
                <span className="font-semibold text-stone-800">4-6 giờ/ngày</span>
              </div>
              <div className="flex justify-between">
                <span>Nguy cơ cháy sém:</span>
                <span className="font-semibold text-emerald-700">An toàn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vital 3: Tình trạng Lá */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border tabular-nums ${getScoreColor(vitals.foliage)}`}>
                {vitals.foliage}%
              </span>
            </div>

            <h3 className="text-base font-bold text-stone-900 mt-3">Sức Khỏe Tán Lá</h3>
            <p className="text-xs text-stone-500 mt-1">
              Sắc tố lá, búp non & nguy cơ sâu hại
            </p>

            <div className="mt-3 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(vitals.foliage)}`}
                style={{ width: `${vitals.foliage}%` }}
              />
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Tình trạng phiến:</span>
                <span className="font-semibold text-stone-800">Xanh mướt</span>
              </div>
              <div className="flex justify-between">
                <span>Búp non mới:</span>
                <span className="font-semibold text-emerald-700">Đang bật chồi</span>
              </div>
              <div className="flex justify-between">
                <span>Rệp sáp / bọ trĩ:</span>
                <span className="font-semibold text-emerald-700">Không phát hiện</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vital 4: Quá trình Chăm sóc */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border tabular-nums ${getScoreColor(vitals.careDiscipline)}`}>
                {vitals.careDiscipline}%
              </span>
            </div>

            <h3 className="text-base font-bold text-stone-900 mt-3">Kỷ Luật Chăm Sóc</h3>
            <p className="text-xs text-stone-500 mt-1">
              Tuân thủ lịch tưới, bón & lau lá
            </p>

            <div className="mt-3 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(vitals.careDiscipline)}`}
                style={{ width: `${vitals.careDiscipline}%` }}
              />
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Tưới đúng hạn:</span>
                <span className="font-semibold text-stone-800">95%</span>
              </div>
              <div className="flex justify-between">
                <span>Bón phân định kỳ:</span>
                <span className="font-semibold text-stone-800">Đạt chuẩn</span>
              </div>
              <div className="flex justify-between">
                <span>Vệ sinh bụi lá:</span>
                <span className="font-semibold text-emerald-700">Đều đặn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Health Matrix Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif-title">
              Bảng Theo Dõi Sức Khỏe Toàn Diện (Health Matrix)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Chi tiết từng yếu tố và đề xuất can thiệp cho người trồng
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs border-b border-stone-200">
              <tr>
                <th className="px-5 py-3 font-semibold">Hạng mục kiểm tra</th>
                <th className="px-5 py-3 font-semibold">Tình trạng thực tế</th>
                <th className="px-5 py-3 font-semibold">Mức độ an toàn</th>
                <th className="px-5 py-3 font-semibold">Khuyến nghị từ Cứu Cây</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              <tr>
                <td className="px-5 py-3.5 font-medium text-stone-900 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Độ ẩm & Đất trồng</span>
                </td>
                <td className="px-5 py-3.5">
                  Đất ráo thoáng, độ ẩm {latestLog?.moisturePercent || 60}%
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> An toàn
                  </span>
                </td>
                <td className="px-5 py-3.5 text-stone-600">
                  Duy trì kiểm tra cắm que 3cm trước khi tưới lượt tiếp theo.
                </td>
              </tr>

              <tr>
                <td className="px-5 py-3.5 font-medium text-stone-900 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Cường độ quang học</span>
                </td>
                <td className="px-5 py-3.5">
                  {currentPlant.sunlight}, không bị nắng thiêu đốt
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tối ưu
                  </span>
                </td>
                <td className="px-5 py-3.5 text-stone-600">
                  Xoay chậu 90 độ mỗi tuần để cây phát triển tán đều.
                </td>
              </tr>

              <tr>
                <td className="px-5 py-3.5 font-medium text-stone-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Phiến lá & Sâu bệnh</span>
                </td>
                <td className="px-5 py-3.5">
                  Lá bóng đẹp, không có nấm hoặc bọ trĩ
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Khỏe mạnh
                  </span>
                </td>
                <td className="px-5 py-3.5 text-stone-600">
                  Lau nhẹ mặt lá 2 tuần/lần bằng nước ấm để thông lỗ khí khổng.
                </td>
              </tr>

              <tr>
                <td className="px-5 py-3.5 font-medium text-stone-900 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Dinh dưỡng & Bón phân</span>
                </td>
                <td className="px-5 py-3.5">
                  Đã bón phân cách đây {Math.floor((Date.now() - new Date(currentPlant.lastFertilized).getTime()) / (1000 * 60 * 60 * 24))} ngày
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-xs">
                    <AlertCircle className="w-3.5 h-3.5" /> Cần chuẩn bị
                  </span>
                </td>
                <td className="px-5 py-3.5 text-stone-600">
                  Sắp đến chu kỳ bón phân bổ sung vi lượng hoặc phân trùn quế.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
