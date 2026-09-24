import React, { useState, useEffect } from 'react';
import { X, Upload, Sprout, Image as ImageIcon } from 'lucide-react';
import { Plant } from '../types/plant';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plantData: Partial<Plant>) => void;
  editingPlant?: Plant | null;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlant,
}) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [sunlight, setSunlight] = useState<'Ít ánh sáng' | 'Ánh sáng gián tiếp' | 'Ánh sáng trực tiếp' | 'Nắng bán phần'>('Ánh sáng gián tiếp');
  const [potSize, setPotSize] = useState('Chậu gốm Ø 20cm');
  const [soilType, setSoilType] = useState('Đất tơi xốp trộn trấu hun & perlite');
  const [waterCycleDays, setWaterCycleDays] = useState(4);
  const [fertilizeCycleDays, setFertilizeCycleDays] = useState(21);
  const [imageUrl, setImageUrl] = useState('/images/monstera_deliciosa_1790162091214.jpg');

  useEffect(() => {
    if (editingPlant) {
      setName(editingPlant.name);
      setSpecies(editingPlant.species);
      setStartDate(editingPlant.startDate);
      setLocation(editingPlant.location);
      setCharacteristics(editingPlant.characteristics);
      setSunlight(editingPlant.sunlight);
      setPotSize(editingPlant.potSize);
      setSoilType(editingPlant.soilType);
      setWaterCycleDays(editingPlant.waterCycleDays);
      setFertilizeCycleDays(editingPlant.fertilizeCycleDays);
      setImageUrl(editingPlant.imageUrl);
    } else {
      setName('');
      setSpecies('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setLocation('Bàn làm việc cạnh cửa sổ');
      setCharacteristics('Cây ưa ẩm nhẹ, phát triển tán xanh, cần lau bụi mặt lá định kỳ.');
      setSunlight('Ánh sáng gián tiếp');
      setPotSize('Chậu sứ Ø 20cm');
      setSoilType('Đất hữu cơ vi sinh trộn perlite thoát nước');
      setWaterCycleDays(4);
      setFertilizeCycleDays(20);
      setImageUrl('/images/pothos_trailing_1790162142706.jpg');
    }
  }, [editingPlant, isOpen]);

  if (!isOpen) return null;

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
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      species: species.trim() || 'Chưa phân loại loài',
      startDate,
      location: location.trim() || 'Trong nhà',
      characteristics: characteristics.trim() || 'Thích nghi tốt với môi trường phòng.',
      sunlight,
      potSize,
      soilType,
      waterCycleDays: Number(waterCycleDays) || 4,
      fertilizeCycleDays: Number(fertilizeCycleDays) || 20,
      imageUrl,
      status: 'healthy',
      healthScore: 90,
      lastWatered: new Date().toISOString().split('T')[0],
      lastFertilized: new Date().toISOString().split('T')[0],
      lastRepotted: startDate,
      repotCycleMonths: 12,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif-title">
                {editingPlant ? 'Chỉnh Sửa Hồ Sơ Cây' : 'Tạo Hồ Sơ Cây Mới'}
              </h2>
              <p className="text-xs text-stone-500">
                Lưu lại thông tin định danh và đặc điểm sinh thái cho cây
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
          {/* Photo & Name */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-stone-100 border border-stone-300 shrink-0 group">
              <img
                src={imageUrl}
                alt="Ảnh cây"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]">
                <Upload className="w-4 h-4 mb-0.5" />
                <span>Đổi ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Tên riêng của cây: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bé Trầu Bà Lá Xẻ, Bàng Singapore..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Loài cây / Tên khoa học:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Monstera Deliciosa, Ficus Lyrata..."
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Dates & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Ngày bắt đầu chăm sóc:
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Vị trí đặt cây: *
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Ban công hướng Đông, Bàn làm việc..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>
          </div>

          {/* Characteristics */}
          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Đặc điểm sinh thái của cây:
            </label>
            <textarea
              rows={2}
              placeholder="Thích ẩm nhẹ, tán lá to, rễ khí sinh cần thông thoáng..."
              value={characteristics}
              onChange={(e) => setCharacteristics(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
            />
          </div>

          {/* Environment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Chế độ ánh sáng:
              </label>
              <select
                value={sunlight}
                onChange={(e) => setSunlight(e.target.value as any)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white"
              >
                <option value="Ánh sáng gián tiếp">Ánh sáng gián tiếp</option>
                <option value="Nắng bán phần">Nắng bán phần</option>
                <option value="Ánh sáng trực tiếp">Ánh sáng trực tiếp</option>
                <option value="Ít ánh sáng">Ít ánh sáng</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Chu kỳ tưới (ngày):
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={waterCycleDays}
                onChange={(e) => setWaterCycleDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Kích thước chậu:
              </label>
              <input
                type="text"
                value={potSize}
                onChange={(e) => setPotSize(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-lg shadow-xs"
            >
              {editingPlant ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ Cây'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
