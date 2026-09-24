import React, { useState, useEffect } from 'react';
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
  Trash2,
  Sparkles,
  MessageCircle,
  HelpCircle,
  X,
  Eye,
  EyeOff,
  Maximize2
} from 'lucide-react';
import { Plant, HealthLog } from '../types/plant';
import { ChibiPlantAvatar } from './ChibiPlantAvatar';
import { ChibiAIDialog } from './ChibiAIDialog';

interface HealthTrackerTabProps {
  plants: Plant[];
  selectedPlantId: string;
  onSelectPlant: (id: string) => void;
  onOpenNewLogModal: () => void;
  onDeleteLog?: (plantId: string, logId: string) => void;
  onOpenDoctorTab?: () => void;
}

export const HealthTrackerTab: React.FC<HealthTrackerTabProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
  onOpenNewLogModal,
  onDeleteLog,
  onOpenDoctorTab,
}) => {
  const currentPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  const [chibiModalPlant, setChibiModalPlant] = useState<Plant | null>(null);
  
  // State for showing/closing the detailed view of the selected plant
  const [isDetailOpen, setIsDetailOpen] = useState(true);

  // State for viewing a specific weekly log in a focused modal
  const [viewingLogModal, setViewingLogModal] = useState<HealthLog | null>(null);

  // Close log modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewingLogModal) {
          setViewingLogModal(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingLogModal]);

  if (!currentPlant) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
        <p className="text-stone-500">Chưa có cây nào trong danh sách. Vui lòng tạo hồ sơ cây mới.</p>
      </div>
    );
  }

  const logs = [...(currentPlant.healthLogs || [])].reverse();
  const latestLog = logs[0];

  return (
    <div className="space-y-6">
      {/* 1. DEDICATED SECTION FOR EACH PLANT TYPE */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Theo Dõi Sức Khỏe Từng Cây
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">
                {plants.length} cây trong bộ sưu tập
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-stone-900 font-serif-title mt-0.5">
              Danh Mục Sức Khỏe & Chibi AI Của Các Bé Cây
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Nhấp vào từng cây để xem biểu cảm Chibi AI trực quan phản ánh tình trạng lá, đất và năng lượng của cây
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isDetailOpen && (
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                title="Tắt xem chi tiết mục đang chọn"
              >
                <EyeOff className="w-4 h-4 text-stone-500" />
                <span>Tắt xem chi tiết</span>
              </button>
            )}

            <button
              onClick={onOpenNewLogModal}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Camera className="w-4 h-4" />
              <span>Ghi Nhật Ký Ảnh Mới</span>
            </button>
          </div>
        </div>

        {/* Plant Cards Grid - One section for each plant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {plants.map((plant) => {
            const isSelected = plant.id === currentPlant.id;
            const isCurrentlyOpen = isSelected && isDetailOpen;
            const score = plant.healthScore ?? 85;
            const plantLogs = plant.healthLogs || [];

            return (
              <div
                key={plant.id}
                onClick={() => {
                  if (isSelected && isDetailOpen) {
                    // Clicking the currently viewed plant toggles it off
                    setIsDetailOpen(false);
                  } else {
                    onSelectPlant(plant.id);
                    setIsDetailOpen(true);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                  isCurrentlyOpen
                    ? 'bg-emerald-50/60 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : isSelected
                    ? 'bg-stone-100/90 border-stone-300'
                    : 'bg-stone-50/80 hover:bg-white border-stone-200 hover:border-emerald-400 hover:shadow-sm'
                }`}
              >
                {/* Active Indicator Badge with Close / Tắt Action */}
                {isCurrentlyOpen ? (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold shadow-xs">
                      Đang xem
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDetailOpen(false);
                      }}
                      className="px-1.5 py-0.5 rounded-full bg-stone-900/80 hover:bg-rose-600 text-white text-[10px] font-medium flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="Tắt xem mục này"
                    >
                      <X className="w-2.5 h-2.5" />
                      <span>Tắt</span>
                    </button>
                  </div>
                ) : isSelected ? (
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[10px] font-medium">
                      Đã chọn (Tắt xem)
                    </span>
                  </div>
                ) : null}

                <div className="flex items-start gap-3">
                  {/* Plant Photo */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('/images/monstera_deliciosa_1790162091214.jpg')) {
                          target.src = '/images/monstera_deliciosa_1790162091214.jpg';
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Plant Info */}
                  <div className="flex-1 min-w-0 pr-12">
                    <h3 className="font-bold text-stone-900 text-sm truncate group-hover:text-emerald-800 transition-colors">
                      {plant.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 truncate italic">
                      {plant.species}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      📍 {plant.location}
                    </p>
                  </div>
                </div>

                {/* Chibi AI Preview & Status Bar */}
                <div className="mt-3 pt-2.5 border-t border-stone-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlant(plant.id);
                        setChibiModalPlant(plant);
                      }}
                      title="Nhấp để trò chuyện với Chibi AI"
                      className="cursor-pointer hover:scale-110 transition-transform"
                    >
                      <ChibiPlantAvatar
                        plant={plant}
                        size="sm"
                        showSpeechBubble={false}
                        interactive={false}
                      />
                    </div>
                    <div className="text-[11px]">
                      <span className="font-semibold text-stone-800 block">
                        {score >= 80
                          ? '🌿 Rất vui vẻ'
                          : score >= 60
                          ? '🌱 Ổn định'
                          : score >= 40
                          ? '💧 Hơi khát'
                          : '🩹 Cần cấp cứu'}
                      </span>
                      <span className="text-stone-400 text-[10px]">
                        {plantLogs.length} bản ghi
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        score >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : score >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {score}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 & 3: DETAILED VIEW OR COLLAPSED BAR */}
      {!isDetailOpen ? (
        /* Collapsed / Dismissed state when user clicks "Tắt xem mục này" */
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
              🌱
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Đang thu gọn chi tiết · Chế độ xem danh mục
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Bạn đã tắt xem chi tiết mục bé <span className="font-semibold text-stone-800">{currentPlant.name}</span>. Chọn một cây bất kỳ ở danh mục trên hoặc nhấp nút bên cạnh để mở lại.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDetailOpen(true)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs shrink-0 active:scale-95 flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Mở xem chi tiết {currentPlant.name}</span>
          </button>
        </div>
      ) : (
        <>
          {/* 2. FEATURED CHIBI AI MASCOT & HEALTH DASHBOARD FOR SELECTED PLANT */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs animate-fadeIn relative">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
              {/* Left / Center: Interactive Chibi AI Mascot with Speech Bubble */}
              <div className="flex flex-col items-center text-center lg:text-left lg:items-start max-w-sm w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Trợ Lý Chibi AI Đồng Hành</span>
                  </span>
                </div>

                <ChibiPlantAvatar
                  plant={currentPlant}
                  latestLog={latestLog}
                  size="lg"
                  showSpeechBubble={true}
                  interactive={true}
                  onOpenDialog={() => setChibiModalPlant(currentPlant)}
                />

                <button
                  onClick={() => setChibiModalPlant(currentPlant)}
                  className="mt-3 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer mx-auto lg:mx-0 shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xem chẩn đoán chi tiết từ Chibi AI</span>
                </button>
              </div>

              {/* Right: Health Metrics and Summary */}
              <div className="flex-1 w-full space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title">
                          {currentPlant.name}
                        </h2>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold hidden sm:inline-block">
                          Đang xem mục này
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                        {currentPlant.species} · Vị trí: {currentPlant.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-stone-400 block">Chỉ số sức khỏe</span>
                        <span
                          className={`text-2xl font-black ${
                            (currentPlant.healthScore ?? 85) >= 80
                              ? 'text-emerald-700'
                              : (currentPlant.healthScore ?? 85) >= 50
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {currentPlant.healthScore ?? 85}%
                        </span>
                      </div>

                      {/* Nút Tắt xem mục này */}
                      <button
                        type="button"
                        onClick={() => setIsDetailOpen(false)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-200 shadow-2xs active:scale-95"
                        title="Tắt xem chi tiết mục này"
                      >
                        <X className="w-4 h-4 text-stone-500" />
                        <span>Tắt xem mục này</span>
                      </button>
                    </div>
                  </div>

                  {/* Health Score Bar */}
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        (currentPlant.healthScore ?? 85) >= 80
                          ? 'bg-emerald-500'
                          : (currentPlant.healthScore ?? 85) >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${currentPlant.healthScore ?? 85}%` }}
                    />
                  </div>
                </div>

                {/* Quick Metrics Grid */}
                {latestLog ? (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-xs text-stone-500 block">Tình trạng gần nhất</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        {latestLog.status === 'healthy' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="text-sm font-bold text-stone-900 truncate">
                          {latestLog.condition}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-500 block">Độ ẩm đất</span>
                      <div className="flex items-center gap-1 mt-1 text-sm font-bold text-stone-900 tabular-nums">
                        <Droplet className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>{latestLog.moisturePercent}%</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-500 block">Chiều cao hiện tại</span>
                      <div className="flex items-center gap-1 mt-1 text-sm font-bold text-stone-900 tabular-nums">
                        <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{latestLog.heightCm} cm</span>
                        {latestLog.newLeavesCount > 0 && (
                          <span className="text-xs font-normal text-emerald-700 ml-0.5">
                            (+{latestLog.newLeavesCount} lá)
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-500 block">Ngày kiểm tra cuối</span>
                      <div className="flex items-center gap-1 mt-1 text-sm font-semibold text-stone-800">
                        <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>{latestLog.date}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-center text-xs text-stone-500">
                    Chưa có bản ghi tuần nào. Nhấp vào "Ghi Nhật Ký Ảnh Mới" để bắt đầu theo dõi cây!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. TIMELINE & WEEKLY HEALTH LOGS */}
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif-title">
                  Dòng Thời Gian Phát Triển Của {currentPlant.name}
                </h2>
                <p className="text-xs text-stone-500">
                  {logs.length} bản ghi lịch sử tuần được lưu trữ · Nhấp vào ảnh để xem phóng to chi tiết
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-stone-100 transition-colors"
                title="Tắt xem chi tiết"
              >
                <X className="w-3.5 h-3.5" />
                <span>Thu gọn / Tắt xem</span>
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-stone-800">Chưa có nhật ký nào</h3>
                <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                  Hãy chụp ảnh và ghi nhận tình trạng đầu tiên của cây để Chibi AI theo dõi sự phát triển.
                </p>
                <button
                  onClick={onOpenNewLogModal}
                  className="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-medium rounded-lg hover:bg-emerald-900 cursor-pointer"
                >
                  Cập nhật nhật ký đầu tiên
                </button>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-800/20 space-y-6">
                {logs.map((log, index) => {
                  const isLatest = index === 0;

                  return (
                    <div key={log.id} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                          log.status === 'healthy' ? 'bg-emerald-600' : 'bg-amber-500'
                        }`}
                      />

                      {/* Log Card */}
                      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-colors">
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

                              {/* Button to open detailed log view */}
                              <button
                                onClick={() => setViewingLogModal(log)}
                                className="px-2.5 py-1 text-xs text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Xem chi tiết bản ghi này"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Xem chi tiết</span>
                              </button>

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
                            {/* Photo Thumbnail - clickable */}
                            <div className="md:col-span-4 lg:col-span-3">
                              <div
                                onClick={() => setViewingLogModal(log)}
                                className="relative rounded-xl overflow-hidden h-44 bg-stone-100 border border-stone-200 cursor-pointer group/photo"
                                title="Nhấp để xem ảnh lớn & chi tiết"
                              >
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
                                  className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 text-xs font-semibold">
                                  <Maximize2 className="w-4 h-4" />
                                  <span>Xem chi tiết</span>
                                </div>
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
                                <div className="p-2.5 rounded-xl bg-stone-50">
                                  <span className="text-stone-500 block text-[11px]">Độ ẩm đất</span>
                                  <span className="font-semibold text-stone-900 tabular-nums">
                                    {log.moisturePercent}%
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-stone-50">
                                  <span className="text-stone-500 block text-[11px]">Chiều cao</span>
                                  <span className="font-semibold text-stone-900 tabular-nums">
                                    {log.heightCm} cm
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-stone-50">
                                  <span className="text-stone-500 block text-[11px]">Lá mới</span>
                                  <span className="font-semibold text-emerald-700 tabular-nums">
                                    +{log.newLeavesCount} lá
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-stone-50">
                                  <span className="text-stone-500 block text-[11px]">Điểm sinh học</span>
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
                                  <div className="p-2.5 bg-stone-50/80 rounded-xl border border-stone-100 text-stone-600 italic">
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
        </>
      )}

      {/* MODAL 1: Chibi AI Full Diagnostic Dialog */}
      <ChibiAIDialog
        plant={chibiModalPlant}
        isOpen={chibiModalPlant !== null}
        onClose={() => setChibiModalPlant(null)}
        onOpenDoctorTab={onOpenDoctorTab}
        onOpenNewLogModal={onOpenNewLogModal}
      />

      {/* MODAL 2: Detailed Weekly Log Viewer Modal with Clear "Tắt xem" Button */}
      {viewingLogModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewingLogModal(null);
            }
          }}
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 my-8 relative">
            {/* Close Button Top Right */}
            <button
              onClick={() => setViewingLogModal(null)}
              className="absolute right-4 top-4 px-2.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
              title="Tắt xem bản ghi này (Esc)"
            >
              <X className="w-4 h-4" />
              <span>Tắt</span>
            </button>

            <div className="pb-3 border-b border-stone-100">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Nhật Ký Sức Khỏe Tuần {viewingLogModal.weekNumber}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif-title mt-0.5">
                Bé {currentPlant.name} ({currentPlant.species})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Ngày ghi nhận: {viewingLogModal.date} · Đánh giá: {viewingLogModal.condition}
              </p>
            </div>

            {/* Photo preview */}
            <div className="mt-4 relative rounded-2xl overflow-hidden h-64 bg-stone-900 border border-stone-200">
              <img
                src={viewingLogModal.imageUrl || currentPlant.imageUrl}
                alt={`Ảnh tuần ${viewingLogModal.weekNumber}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-4">
              <div className="p-2.5 rounded-xl bg-stone-50">
                <span className="text-stone-500 block text-[11px]">Độ ẩm đất</span>
                <span className="font-bold text-stone-900 tabular-nums">
                  {viewingLogModal.moisturePercent}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50">
                <span className="text-stone-500 block text-[11px]">Chiều cao</span>
                <span className="font-bold text-stone-900 tabular-nums">
                  {viewingLogModal.heightCm} cm
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50">
                <span className="text-stone-500 block text-[11px]">Lá mới</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  +{viewingLogModal.newLeavesCount} lá
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50">
                <span className="text-stone-500 block text-[11px]">Điểm sinh học</span>
                <span className="font-bold text-stone-900 tabular-nums">
                  {Math.round(
                    (viewingLogModal.vitals.water +
                      viewingLogModal.vitals.light +
                      viewingLogModal.vitals.foliage +
                      viewingLogModal.vitals.careDiscipline) /
                      4
                  )}
                  /100
                </span>
              </div>
            </div>

            {/* Notes & Observations */}
            <div className="mt-3 space-y-2 text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
              <div>
                <strong className="text-stone-900">Tình trạng lá & ngọn:</strong>{' '}
                <span>{viewingLogModal.leafStatus}</span>
              </div>
              <div>
                <strong className="text-stone-900">Môi trường ánh sáng:</strong>{' '}
                <span>{viewingLogModal.lightStatus}</span>
              </div>
              {viewingLogModal.notes && (
                <div>
                  <strong className="text-stone-900">Ghi chú của người chăm sóc:</strong>{' '}
                  <span className="italic">"{viewingLogModal.notes}"</span>
                </div>
              )}
            </div>

            {/* Symptoms */}
            {viewingLogModal.symptoms && viewingLogModal.symptoms.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Triệu chứng:
                </span>
                {viewingLogModal.symptoms.map((sym, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-xs px-2 py-0.5 bg-amber-50 text-amber-900 rounded-md border border-amber-200"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            )}

            {/* Footer with Clear "Tắt xem bản ghi này" Button */}
            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewingLogModal(null)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Tắt xem bản ghi này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
