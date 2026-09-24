import React, { useState } from 'react';
import { X, Upload, Camera, Droplet, Sun, Leaf, Activity } from 'lucide-react';
import { Plant, HealthLog, HealthStatus } from '../types/plant';

interface NewLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  plant: Plant;
  onSaveLog: (log: HealthLog) => void;
}

export const NewLogModal: React.FC<NewLogModalProps> = ({
  isOpen,
  onClose,
  plant,
  onSaveLog,
}) => {
  const currentLogs = plant.healthLogs || [];
  const nextWeekNumber = (currentLogs[currentLogs.length - 1]?.weekNumber || 0) + 1;
  const lastHeight = currentLogs[currentLogs.length - 1]?.heightCm || 50;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weekNumber, setWeekNumber] = useState(nextWeekNumber);
  const [condition, setCondition] = useState<'Rất tốt' | 'Khá tốt' | 'Cần chú ý' | 'Nguy hiểm'>('Rất tốt');
  const [moisturePercent, setMoisturePercent] = useState(65);
  const [heightCm, setHeightCm] = useState(lastHeight);
  const [newLeavesCount, setNewLeavesCount] = useState(1);
  const [lightStatus, setLightStatus] = useState('Đủ ánh sáng tán xạ 4-6 giờ');
  const [leafStatus, setLeafStatus] = useState('Lá xanh bóng mướt, không có đốm nấm');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState(plant.imageUrl);
  const [symptoms, setSymptoms] = useState<string[]>([]);

  if (!isOpen) return null;

  const symptomOptions = [
    'Vàng lá già ở gốc',
    'Vàng ngọn non',
    'Đốm nâu mép lá',
    'Cháy đầu lá',
    'Đất bị đọng nước lâu',
    'Lá bị mềm rũ',
    'Có bụi bám trên lá',
    'Rệp sáp / Nhện đỏ',
  ];

  const toggleSymptom = (sym: string) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let status: HealthStatus = 'healthy';
    if (condition === 'Cần chú ý') status = 'warning';
    if (condition === 'Nguy hiểm') status = 'critical';

    // Calculate vitals
    const waterScore = Math.max(30, Math.min(100, 100 - Math.abs(moisturePercent - 60)));
    const foliageScore = condition === 'Rất tốt' ? 95 : condition === 'Khá tốt' ? 85 : 65;

    const newLog: HealthLog = {
      id: `log-${Date.now()}`,
      plantId: plant.id,
      date,
      weekNumber: Number(weekNumber) || 1,
      imageUrl,
      condition,
      status,
      moisturePercent: Number(moisturePercent),
      lightStatus,
      leafStatus,
      heightCm: Number(heightCm),
      newLeavesCount: Number(newLeavesCount),
      symptoms,
      notes: notes.trim(),
      vitals: {
        water: waterScore,
        light: 90,
        foliage: foliageScore,
        careDiscipline: 95,
      },
    };

    onSaveLog(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif-title">
                Ghi Nhận Sức Khỏe Mới: {plant.name}
              </h2>
              <p className="text-xs text-stone-500">
                Lưu lại hình ảnh và chỉ số sinh trưởng theo tuần
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs sm:text-sm">
          {/* Photo & Week */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-stone-100 border border-stone-300 shrink-0 group">
              <img
                src={imageUrl}
                alt="Ảnh tuần này"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]">
                <Upload className="w-4 h-4 mb-0.5" />
                <span>Tải ảnh tuần này</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Ngày ghi nhận:
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Mốc theo dõi (Tuần):
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Đánh giá tổng quan:
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white"
                >
                  <option value="Rất tốt">Rất tốt (Lá mở đẹp, không sâu bệnh)</option>
                  <option value="Khá tốt">Khá tốt (Ổn định, phát triển bình thường)</option>
                  <option value="Cần chú ý">Cần chú ý (Vàng mép lá hoặc hơi khô)</option>
                  <option value="Nguy hiểm">Nguy hiểm (Nghi ngờ úng rễ hoặc nấm)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Độ ẩm đất ({moisturePercent}%):
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={moisturePercent}
                onChange={(e) => setMoisturePercent(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-700"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Chiều cao cây (cm):
              </label>
              <input
                type="number"
                min="5"
                max="500"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Số lá non mọc thêm:
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={newLeavesCount}
                onChange={(e) => setNewLeavesCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>
          </div>

          {/* Leaf & Light */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Tình trạng lá & ngọn:
              </label>
              <input
                type="text"
                value={leafStatus}
                onChange={(e) => setLeafStatus(e.target.value)}
                placeholder="Ví dụ: Đang nhú 1 chồi non, phiến lá bóng..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Môi trường nhận sáng:
              </label>
              <input
                type="text"
                value={lightStatus}
                onChange={(e) => setLightStatus(e.target.value)}
                placeholder="Ví dụ: Đủ sáng tán xạ, không nắng gắt..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div>
            <label className="font-semibold text-stone-800 block mb-1.5">
              Dấu hiệu bất thường (nếu có):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {symptomOptions.map((sym) => {
                const isSelected = symptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Notes */}
          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Ghi chú thêm:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Đã lau bụi mặt lá, xoay chậu 90 độ..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-lg shadow-xs"
            >
              Lưu Nhật Ký Tuần
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
