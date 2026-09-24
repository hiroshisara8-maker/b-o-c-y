import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Droplet, 
  Sun, 
  Layers, 
  HeartHandshake,
  Activity,
  ArrowRight,
  Trash2,
  Edit3,
  AlertTriangle,
  X
} from 'lucide-react';
import { Plant, ActiveTab } from '../types/plant';

interface PlantProfileTabProps {
  plants: Plant[];
  selectedPlantId: string;
  onSelectPlant: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (plant: Plant) => void;
  onDeletePlant: (id: string) => void;
  onNavigateTab: (tab: ActiveTab, plantId?: string) => void;
}

export const PlantProfileTab: React.FC<PlantProfileTabProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
  onOpenAddModal,
  onOpenEditModal,
  onDeletePlant,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [plantToDelete, setPlantToDelete] = useState<Plant | null>(null);

  const filteredPlants = plants.filter((plant) => {
    const matchSearch =
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || plant.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getDaysCount = (startDate: string) => {
    const diff = Date.now() - new Date(startDate).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Overview & Action Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title">
              Hồ Sơ Cây Trồng
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Quản lý danh mục từng cây, theo dõi vị trí đặt, đặc tính sinh thái và lịch sử chăm sóc riêng biệt.
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="self-start md:self-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Hồ Sơ Cây Mới</span>
          </button>
        </div>

        {/* Quick Plant Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-lg">
            <span className="text-xs text-stone-500">Tổng số cây</span>
            <p className="text-xl font-bold text-stone-900 mt-0.5 tabular-nums">
              {plants.length} <span className="text-xs font-normal text-stone-500">cây</span>
            </p>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-lg">
            <span className="text-xs text-emerald-700">Đang phát triển tốt</span>
            <p className="text-xl font-bold text-emerald-800 mt-0.5 tabular-nums">
              {plants.filter((p) => p.status === 'healthy').length}{' '}
              <span className="text-xs font-normal text-emerald-700">cây</span>
            </p>
          </div>
          <div className="p-3 bg-amber-50/60 rounded-lg">
            <span className="text-xs text-amber-700">Cần theo dõi sát</span>
            <p className="text-xl font-bold text-amber-800 mt-0.5 tabular-nums">
              {plants.filter((p) => p.status !== 'healthy').length}{' '}
              <span className="text-xs font-normal text-amber-700">cây</span>
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg">
            <span className="text-xs text-stone-500">Đồng hành lâu nhất</span>
            <p className="text-xl font-bold text-stone-900 mt-0.5 tabular-nums">
              {plants.length > 0 ? Math.max(...plants.map((p) => getDaysCount(p.startDate))) : 0}{' '}
              <span className="text-xs font-normal text-stone-500">ngày</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên cây, loài, hoặc vị trí đặt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          >
          </input>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tất cả ({plants.length})
          </button>
          <button
            onClick={() => setStatusFilter('healthy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'healthy'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Xanh tốt ({plants.filter((p) => p.status === 'healthy').length})
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'warning'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Cần chú ý ({plants.filter((p) => p.status !== 'healthy').length})
          </button>
        </div>
      </div>

      {/* Plant Cards Grid */}
      {filteredPlants.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-stone-800">Không tìm thấy cây phù hợp</h3>
          <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Tạo Hồ Sơ Cây Mới" để bổ sung cây của bạn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredPlants.map((plant) => {
            const daysTogether = getDaysCount(plant.startDate);
            const isSelected = plant.id === selectedPlantId;

            return (
              <div
                key={plant.id}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Top Image + Quick Status */}
                  <div className="relative h-52 sm:h-56 bg-stone-100 overflow-hidden">
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('/images/monstera_deliciosa_1790162091214.jpg')) {
                          target.src = '/images/monstera_deliciosa_1790162091214.jpg';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Badge on Photo */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md text-white backdrop-blur-md ${
                          plant.status === 'healthy'
                            ? 'bg-emerald-600/90'
                            : plant.status === 'warning'
                            ? 'bg-amber-600/90'
                            : 'bg-rose-600/90'
                        }`}
                      >
                        {plant.status === 'healthy' ? 'Khỏe mạnh' : 'Cần chú ý'}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded-md bg-stone-900/70 text-stone-200 backdrop-blur-md tabular-nums">
                        Điểm: {plant.healthScore}/100
                      </span>
                    </div>

                    {/* Edit/Delete Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEditModal(plant);
                        }}
                        title="Chỉnh sửa hồ sơ"
                        className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 flex items-center justify-center transition-colors shadow-xs"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlantToDelete(plant);
                        }}
                        title="Xóa cây"
                        className="w-8 h-8 rounded-full bg-white/80 hover:bg-rose-50 hover:text-rose-600 text-stone-700 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-lg font-bold drop-shadow-sm font-serif-title">
                        {plant.name}
                      </h3>
                      <p className="text-xs text-stone-200 italic line-clamp-1">
                        {plant.species}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3.5">
                    {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-stone-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Bắt đầu: {plant.startDate} ({daysTogether} ngày)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span className="line-clamp-1">{plant.location}</span>
                      </div>
                    </div>

                    {/* Characteristics */}
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs text-stone-700">
                      <span className="font-semibold text-stone-900 block mb-1">Đặc điểm sinh thái:</span>
                      <p className="line-clamp-2 leading-relaxed text-stone-600">
                        {plant.characteristics}
                      </p>
                    </div>

                    {/* Environment Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{plant.sunlight}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">Tưới {plant.waterCycleDays} ngày/lần</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">{plant.potSize}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{plant.healthLogs?.length || 0} lần ghi nhật ký</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="px-4 sm:px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onSelectPlant(plant.id);
                      onNavigateTab('health-tracker', plant.id);
                    }}
                    className="text-xs font-medium text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Nhật ký sức khỏe</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectPlant(plant.id);
                      onNavigateTab('care-plan', plant.id);
                    }}
                    className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Kế hoạch AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Delete Confirmation Modal (Safe for iFrame & Mobile) */}
      {plantToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPlantToDelete(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 font-serif-title">
                  Xác Nhận Xóa Hồ Sơ Cây
                </h3>
              </div>
              <button
                onClick={() => setPlantToDelete(null)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <p className="text-stone-600">
                Bạn có chắc chắn muốn xóa vĩnh viễn cây{' '}
                <span className="font-bold text-stone-900">"{plantToDelete.name}"</span> (
                <span className="italic">{plantToDelete.species}</span>) khỏi danh mục quản lý không?
              </p>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/80 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Cảnh báo:</strong> Toàn bộ hình ảnh, lịch sử theo dõi sức khỏe theo tuần và các cảnh báo nhắc nhở của cây này cũng sẽ bị xóa vĩnh viễn và không thể khôi phục.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPlantToDelete(null)}
                className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = plantToDelete.id;
                  setPlantToDelete(null);
                  onDeletePlant(id);
                }}
                className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
