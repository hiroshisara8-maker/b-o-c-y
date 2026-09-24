import React, { useState } from 'react';
import { 
  Sparkles, 
  Droplet, 
  Sun, 
  Leaf, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  BookOpen, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Plant } from '../types/plant';

interface AICarePlanTabProps {
  plants: Plant[];
  selectedPlantId: string;
  onSelectPlant: (id: string) => void;
  onUpdatePlantPlan: (plantId: string, plan: any) => void;
}

export const AICarePlanTab: React.FC<AICarePlanTabProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
  onUpdatePlantPlan,
}) => {
  const currentPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Weekly checklist states (temporary interactive checks for today's session)
  const [completedWeeklyTasks, setCompletedWeeklyTasks] = useState<Record<string, boolean>>({});

  if (!currentPlant) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
        <p className="text-stone-500">Chưa có cây nào trong danh mục.</p>
      </div>
    );
  }

  // Fallback default plan if plant doesn't have custom generated plan yet
  const plan = currentPlant.customPlan || {
    summary: `Kế hoạch cá nhân hóa cho ${currentPlant.name} (${currentPlant.species}) tại ${currentPlant.location}. Được AI phân tích tối ưu dựa trên đặc tính ưa ${currentPlant.sunlight.toLowerCase()} và giá thể ${currentPlant.soilType}.`,
    waterSchedule: {
      frequency: `${currentPlant.waterCycleDays} ngày một lần`,
      amount: 'Khoảng 200 - 300ml quanh gốc',
      technique: 'Tưới chậm đều khắp mặt chậu cho đến khi róc đáy, đổ đĩa sau 15 phút.',
      soilTestTip: 'Cắm ngón tay trỏ sâu 3cm, nếu đất khô ráo hoàn toàn thì mới tưới.',
    },
    lightAdvice: {
      intensity: `${currentPlant.sunlight} (tán xạ 65-75%)`,
      placement: `${currentPlant.location}, cách cửa sổ khoảng 1m có rèm cản nắng gắt trưa.`,
      warning: 'Nếu lá vươn dài mảnh khảnh là thiếu sáng; nếu viền lá giòn nâu là bị nắng thiêu đốt.',
    },
    fertilizerPlan: {
      type: 'Phân trùn quế hữu cơ kết hợp phân bón lá vi lượng NPK 20-20-20 pha loãng 50%.',
      frequency: `${currentPlant.fertilizeCycleDays} ngày một lần vào mùa sinh trưởng.`,
      dosage: '1 thìa cà phê cho 2 lít nước tưới ẩm gốc.',
    },
    weeklyTasks: [
      { weekDay: 'Thứ 2', task: 'Kiểm tra độ ẩm đáy chậu, dùng khăn ẩm lau sạch bụi bề mặt lá.', icon: 'leaf' },
      { weekDay: 'Thứ 4', task: 'Xoay chậu 90 độ theo chiều kim đồng hồ để cây cân đối quang hợp.', icon: 'sun' },
      { weekDay: 'Thứ 6', task: 'Tưới nước đẫm theo chu kỳ nếu que đo báo đất đã ráo.', icon: 'water' },
      { weekDay: 'Chủ nhật', task: 'Kiểm tra nách lá và mặt sau lá xem có bọ trĩ, tỉa bỏ lá già úa.', icon: 'check' },
    ],
    emergencySigns: [
      'Lá vàng mềm rũ: Nguy cơ ngập úng rễ. Ngưng tưới 5 ngày, xới thoáng đất mặt chậu.',
      'Đầu lá cháy khô nhọn: Thiếu độ ẩm không khí hoặc đọng muối khoáng. Phun sương tạo ẩm xung quanh.',
      'Cây rụng lá hàng loạt: Sốc nhiệt độ hoặc gió lùa điều hòa. Chuyển cây sang góc kín gió.',
    ],
    specialTips: 'Luôn giữ cho đáy chậu có khoảng hở để thoát nước tự nhiên. Không bao giờ để chậu ngâm trong vũng nước tù đọng quá 30 phút.',
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/care-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantName: currentPlant.name,
          species: currentPlant.species,
          location: currentPlant.location,
          lightLevel: currentPlant.sunlight,
          soilType: currentPlant.soilType,
          potSize: currentPlant.potSize,
          ageWeeks: currentPlant.healthLogs?.length || 4,
          careHistory: `Tưới ${currentPlant.waterCycleDays} ngày/lần, đã bón phân cách đây ${currentPlant.lastFertilized}`,
          currentCondition: currentPlant.status === 'healthy' ? 'Khỏe mạnh phát triển tốt' : 'Có dấu hiệu cần can thiệp',
        }),
      });

      const data = await response.json();
      if (data.success && data.plan) {
        onUpdatePlantPlan(currentPlant.id, data.plan);
      } else {
        throw new Error(data.message || 'Không thể tạo kế hoạch');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Không thể kết nối máy chủ AI. Đã kích hoạt kế hoạch dự phòng tối ưu.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    setCompletedWeeklyTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                AI Phân Tích Thực Vật Chuyên Sâu
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">
                Đặc thù hóa cho từng môi trường sống
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title mt-1">
              Kế Hoạch Chăm Sóc AI: {currentPlant.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              AI xây dựng lịch tưới, kỹ thuật ánh sáng, chế độ bón phân và việc cần làm theo tuần.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Plant selector */}
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
              onClick={handleGeneratePlan}
              disabled={loading}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'AI đang lập lộ trình...' : 'Tạo Lại Kế Hoạch AI'}</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* AI Biological Summary Note */}
        <div className="mt-5 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
              Nhận Định Sinh Thái Học Từ AI
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900/90 mt-1 leading-relaxed">
              {plan.summary}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Pillar Cards: Water, Light, Nutrition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Water Schedule */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
              <Droplet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif-title">
              1. Lịch & Kỹ Thuật Tưới Nước
            </h3>

            <div className="mt-3 space-y-2 text-xs text-stone-700">
              <div className="p-2.5 rounded-lg bg-stone-50">
                <span className="text-stone-500 block text-[11px]">Tần suất khuyến nghị:</span>
                <span className="font-semibold text-stone-900 text-sm">
                  {plan.waterSchedule?.frequency || '3 - 4 ngày/lần'}
                </span>
              </div>

              <div>
                <span className="font-semibold text-stone-900">Lượng nước:</span>{' '}
                <span className="text-stone-600">{plan.waterSchedule?.amount}</span>
              </div>

              <div>
                <span className="font-semibold text-stone-900">Kỹ thuật:</span>{' '}
                <span className="text-stone-600">{plan.waterSchedule?.technique}</span>
              </div>

              <div className="p-2.5 bg-sky-50/60 rounded-md border border-sky-100 text-sky-900 text-[11px] leading-relaxed">
                <strong>Mẹo cắm que:</strong> {plan.waterSchedule?.soilTestTip}
              </div>
            </div>
          </div>
        </div>

        {/* Light Advice */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif-title">
              2. Ánh Sáng & Vị Trí Tối Ưu
            </h3>

            <div className="mt-3 space-y-2 text-xs text-stone-700">
              <div className="p-2.5 rounded-lg bg-stone-50">
                <span className="text-stone-500 block text-[11px]">Cường độ quang học:</span>
                <span className="font-semibold text-stone-900 text-sm">
                  {plan.lightAdvice?.intensity}
                </span>
              </div>

              <div>
                <span className="font-semibold text-stone-900">Vị trí đặt:</span>{' '}
                <span className="text-stone-600">{plan.lightAdvice?.placement}</span>
              </div>

              <div className="p-2.5 bg-amber-50/60 rounded-md border border-amber-100 text-amber-900 text-[11px] leading-relaxed">
                <strong>Cảnh báo:</strong> {plan.lightAdvice?.warning}
              </div>
            </div>
          </div>
        </div>

        {/* Fertilizer Plan */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif-title">
              3. Dinh Dưỡng & Phân Bón
            </h3>

            <div className="mt-3 space-y-2 text-xs text-stone-700">
              <div className="p-2.5 rounded-lg bg-stone-50">
                <span className="text-stone-500 block text-[11px]">Chu kỳ bón:</span>
                <span className="font-semibold text-stone-900 text-sm">
                  {plan.fertilizerPlan?.frequency}
                </span>
              </div>

              <div>
                <span className="font-semibold text-stone-900">Loại dinh dưỡng:</span>{' '}
                <span className="text-stone-600">{plan.fertilizerPlan?.type}</span>
              </div>

              <div>
                <span className="font-semibold text-stone-900">Liều lượng an toàn:</span>{' '}
                <span className="text-stone-600">{plan.fertilizerPlan?.dosage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Action Schedule */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-serif-title flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-800" />
              <span>Lịch Nhiệm Vụ Hàng Tuần (Weekly Care Schedule)</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Đánh dấu các việc đã làm để giữ kỷ luật chăm sóc cây trồng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plan.weeklyTasks?.map((taskItem: any, idx: number) => {
            const taskId = `task-${currentPlant.id}-${idx}`;
            const isDone = !!completedWeeklyTasks[taskId];

            return (
              <div
                key={idx}
                onClick={() => toggleTask(taskId)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-900">
                      {taskItem.weekDay}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-700 text-white'
                          : 'border border-stone-300 bg-white text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      isDone ? 'line-through text-stone-400' : 'text-stone-700'
                    }`}
                  >
                    {taskItem.task}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-stone-200/50 text-[11px] text-stone-500">
                  {isDone ? '✓ Đã hoàn thành' : 'Chưa thực hiện'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Signs & Expert Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Signs */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5 text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Dấu Hiệu Cảnh Báo Khẩn & Cách Khắc Phục</span>
          </h3>

          <ul className="space-y-2.5 text-xs text-stone-700">
            {plan.emergencySigns?.map((sign: string, sIdx: number) => (
              <li key={sIdx} className="flex items-start gap-2 p-2.5 rounded-lg bg-stone-50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{sign}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Special tips */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5 text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Lời Khuyên Vàng Từ Chuyên Gia Nông Học</span>
          </h3>

          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
            <p>{plan.specialTips}</p>
            <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800">
              <span>Được tính toán bởi Cứu Cây AI</span>
              <span className="font-semibold">Cập nhật theo chu kỳ sống</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
