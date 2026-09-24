import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Sprout,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  Link2
} from 'lucide-react';
import { Plant } from '../types/plant';
import { PLANT_TEMPLATES, PlantTemplate, findPlantTemplate } from '../data/plantTemplates';

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

  // Suggestion templates states
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [templateFilterCategory, setTemplateFilterCategory] = useState<string>('Tất cả');
  const [templateSearch, setTemplateSearch] = useState('');
  const [appliedTemplateNotification, setAppliedTemplateNotification] = useState<string | null>(null);

  // Two-way auto-sync state between plant name and English species name
  const [autoSync, setAutoSync] = useState(true);
  const [lastSyncNotice, setLastSyncNotice] = useState<string | null>(null);

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
      setShowTemplatePicker(false);
      setLastSyncNotice(null);
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
      setShowTemplatePicker(false);
      setLastSyncNotice(null);
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

  const handleApplyTemplate = (template: PlantTemplate) => {
    setSpecies(`${template.englishName} (${template.vietnameseName})`);

    // Auto-fill friendly name if empty or generic
    if (!name.trim() || name === 'Bé Trầu Bà Lá Xẻ' || name === 'Cây mới') {
      setName(template.defaultPlantName);
    }

    setCharacteristics(template.characteristics);
    setWaterCycleDays(template.waterCycleDays);
    setSunlight(template.sunlight);
    setSoilType(template.soilType);
    if (template.imageUrl) {
      setImageUrl(template.imageUrl);
    }

    setAppliedTemplateNotification(
      `Đã áp dụng mẫu "${template.englishName}": Tưới ${template.waterCycleDays} ngày/lần, ${template.sunlight.toLowerCase()}.`
    );

    setTimeout(() => {
      setAppliedTemplateNotification(null);
    }, 4000);
  };

  // Two-way synchronization handlers
  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSync && val.trim().length >= 2) {
      const matched = findPlantTemplate(val);
      if (matched) {
        setSpecies(`${matched.englishName} (${matched.vietnameseName})`);
        setCharacteristics(matched.characteristics);
        setWaterCycleDays(matched.waterCycleDays);
        setSunlight(matched.sunlight);
        setSoilType(matched.soilType);
        if (matched.imageUrl) {
          setImageUrl(matched.imageUrl);
        }
        setLastSyncNotice(`Đã tự động điền Tên tiếng Anh: "${matched.englishName}"`);
      }
    }
  };

  const handleNameBlur = () => {
    if (autoSync && name.trim().length >= 2 && (!species.trim() || species === 'Chưa phân loại loài')) {
      const matched = findPlantTemplate(name);
      if (matched) {
        setSpecies(`${matched.englishName} (${matched.vietnameseName})`);
        setCharacteristics(matched.characteristics);
        setWaterCycleDays(matched.waterCycleDays);
        setSunlight(matched.sunlight);
        setSoilType(matched.soilType);
        if (matched.imageUrl) {
          setImageUrl(matched.imageUrl);
        }
        setLastSyncNotice(`Đã tự động điền Tên tiếng Anh: "${matched.englishName}"`);
      }
    }
  };

  const handleSpeciesChange = (val: string) => {
    setSpecies(val);
    if (autoSync && val.trim().length >= 2) {
      const matched = findPlantTemplate(val);
      if (matched) {
        // Auto-fill plant name if empty, or if it matches previous template/default
        if (!name.trim() || name === 'Bé Trầu Bà Lá Xẻ' || name.startsWith('Bé ') || name.startsWith('Cây ')) {
          setName(matched.defaultPlantName);
        }
        setCharacteristics(matched.characteristics);
        setWaterCycleDays(matched.waterCycleDays);
        setSunlight(matched.sunlight);
        setSoilType(matched.soilType);
        if (matched.imageUrl) {
          setImageUrl(matched.imageUrl);
        }
        setLastSyncNotice(`Đã tự động điền Tên riêng của cây: "${matched.defaultPlantName}"`);
      }
    }
  };

  const handleSpeciesBlur = () => {
    if (autoSync && species.trim().length >= 2 && !name.trim()) {
      const matched = findPlantTemplate(species);
      if (matched) {
        setName(matched.defaultPlantName);
        setCharacteristics(matched.characteristics);
        setWaterCycleDays(matched.waterCycleDays);
        setSunlight(matched.sunlight);
        setSoilType(matched.soilType);
        if (matched.imageUrl) {
          setImageUrl(matched.imageUrl);
        }
        setLastSyncNotice(`Đã tự động điền Tên riêng của cây: "${matched.defaultPlantName}"`);
      } else {
        const cleanName = species.split('(')[0].trim();
        setName(`Bé ${cleanName}`);
      }
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

  const quickPillTemplates = PLANT_TEMPLATES.slice(0, 6);

  const filteredTemplates = PLANT_TEMPLATES.filter((tmpl) => {
    const matchesCategory =
      templateFilterCategory === 'Tất cả' || tmpl.category === templateFilterCategory;
    const query = templateSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      tmpl.englishName.toLowerCase().includes(query) ||
      tmpl.scientificName.toLowerCase().includes(query) ||
      tmpl.vietnameseName.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const categories = ['Tất cả', 'Kiểng lá', 'Lọc khí & Dễ trồng', 'Mọng nước & Sen đá', 'Hoa cảnh'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif-title">
                {editingPlant ? 'Chỉnh Sửa Hồ Sơ Cây' : 'Tạo Hồ Sơ Cây Mới'}
              </h2>
              <p className="text-xs text-stone-500">
                Lưu lại thông tin định danh, tên tiếng Anh chuẩn và thông số sinh học
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Applied Template Toast Banner */}
        {appliedTemplateNotification && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="flex-1 font-medium">{appliedTemplateNotification}</span>
            <button
              type="button"
              onClick={() => setAppliedTemplateNotification(null)}
              className="text-emerald-500 hover:text-emerald-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          {/* Photo & Name */}
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
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
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-800 flex items-center gap-1">
                    <span>Tên riêng của cây: *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAutoSync(!autoSync)}
                    title="Bật / Tắt tự động đồng bộ giữa Tên riêng và Tên tiếng Anh"
                    className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                      autoSync
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 font-medium'
                        : 'text-stone-400 bg-stone-100 border border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    <span>{autoSync ? 'Đồng bộ 2 chiều: Bật' : 'Đồng bộ: Tắt'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Bé Trầu Bà Lá Xẻ, Bàng Singapore, Lưỡi Hổ..."
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={handleNameBlur}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-2 focus:ring-emerald-700 pr-8"
                  />
                  {name ? (
                    <button
                      type="button"
                      onClick={() => setName('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                      title="Xóa nhanh"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* English Name / Species with Suggestion Templates */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <span>Tên tiếng Anh / Tên khoa học:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{showTemplatePicker ? 'Thu gọn gợi ý' : '💡 Mẫu gợi ý tiếng Anh'}</span>
                    {showTemplatePicker ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    list="plant-english-suggestions"
                    placeholder="Ví dụ: Monstera Deliciosa, Snake Plant, Fiddle Leaf Fig..."
                    value={species}
                    onChange={(e) => handleSpeciesChange(e.target.value)}
                    onBlur={handleSpeciesBlur}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-2 focus:ring-emerald-700 pr-8 text-xs sm:text-sm"
                  />
                  {species ? (
                    <button
                      type="button"
                      onClick={() => setSpecies('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                      title="Xóa nhanh"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>

                {/* Two-way sync hint notification */}
                {lastSyncNotice && (
                  <div className="mt-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center justify-between gap-1.5 animate-fadeIn">
                    <span className="flex items-center gap-1.5">
                      <Link2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{lastSyncNotice}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setLastSyncNotice(null)}
                      className="text-emerald-500 hover:text-emerald-700 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Native HTML5 autocomplete list */}
                <datalist id="plant-english-suggestions">
                  {PLANT_TEMPLATES.map((tmpl) => (
                    <option
                      key={tmpl.id}
                      value={`${tmpl.englishName} (${tmpl.vietnameseName})`}
                    >
                      {tmpl.scientificName} - {tmpl.vietnameseName}
                    </option>
                  ))}
                </datalist>

                {/* Quick Chips for Most Common English Names */}
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-stone-500 font-medium shrink-0">
                    Gợi ý mẫu:
                  </span>
                  {quickPillTemplates.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleApplyTemplate(item)}
                      title={`Áp dụng mẫu ${item.englishName} - Tưới ${item.waterCycleDays} ngày/lần`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-700 transition-colors border border-stone-200 hover:border-emerald-300"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.englishName.split('(')[0].trim()}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium"
                  >
                    <span>+{PLANT_TEMPLATES.length - quickPillTemplates.length} mẫu khác...</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expandable Interactive Plant Template Picker Drawer */}
          {showTemplatePicker && (
            <div className="p-3.5 bg-stone-50 border border-stone-300 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold text-stone-900 text-xs sm:text-sm">
                    Thư Viện Mẫu Tên Tiếng Anh & Hồ Sơ Sinh Học
                  </h4>
                </div>
                <span className="text-[11px] text-stone-500">
                  Nhấp để tự động điền tên, ánh sáng & chu kỳ tưới
                </span>
              </div>

              {/* Search & Categories */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Tìm tên tiếng Anh, tên khoa học hoặc tiếng Việt..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700"
                  />
                  {templateSearch && (
                    <button
                      type="button"
                      onClick={() => setTemplateSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTemplateFilterCategory(cat)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        templateFilterCategory === cat
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredTemplates.length === 0 ? (
                  <div className="col-span-2 text-center py-4 text-xs text-stone-500 bg-white rounded-lg border border-stone-200">
                    Không tìm thấy mẫu cây phù hợp với từ khóa "{templateSearch}".
                  </div>
                ) : (
                  filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleApplyTemplate(template)}
                      className="text-left p-2.5 bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg transition-all group flex flex-col justify-between gap-1 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-1 w-full">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{template.emoji}</span>
                          <div>
                            <div className="font-semibold text-stone-900 group-hover:text-emerald-800 text-xs">
                              {template.englishName}
                            </div>
                            <div className="text-[11px] text-stone-500 italic">
                              {template.scientificName}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                          {template.vietnameseName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px] text-stone-500 w-full">
                        <span>💧 Tưới: {template.waterCycleDays} ngày/lần</span>
                        <span>☀️ {template.sunlight}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

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
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-stone-800">
                Đặc điểm sinh thái của cây:
              </label>
              <span className="text-[11px] text-stone-400">
                (Tự động cập nhật theo mẫu gợi ý hoặc tự viết)
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="Thích ẩm nhẹ, tán lá to, rễ khí sinh cần thông thoáng..."
              value={characteristics}
              onChange={(e) => setCharacteristics(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 text-xs sm:text-sm"
            />
          </div>

          {/* Soil Type */}
          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Loại giá thể / Đất trồng:
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Đất hữu cơ vi sinh trộn perlite thoát nước..."
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 text-xs sm:text-sm"
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
              className="px-4 py-2 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-lg shadow-xs transition-colors"
            >
              {editingPlant ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ Cây'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

