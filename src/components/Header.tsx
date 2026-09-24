import React, { useRef } from 'react';
import { 
  FolderHeart, 
  Activity, 
  GitCompare, 
  Gauge, 
  BellRing, 
  CalendarCheck2, 
  Bot, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Sprout,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ActiveTab } from '../types/plant';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingAlertsCount: number;
  onOpenAddModal: () => void;
  plantCount: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

interface TabItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  pendingAlertsCount,
  onOpenAddModal,
  plantCount,
  soundEnabled = true,
  onToggleSound,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs: TabItem[] = [
    {
      id: 'profiles',
      label: 'Hồ sơ cây',
      icon: FolderHeart,
      description: 'Quản lý & đặc điểm',
    },
    {
      id: 'health-tracker',
      label: 'Theo dõi sức khỏe',
      icon: Activity,
      description: 'Hình ảnh & nhật ký',
    },
    {
      id: 'growth-compare',
      label: 'So sánh phát triển',
      icon: GitCompare,
      description: 'Đối chiếu theo tuần',
    },
    {
      id: 'health-index',
      label: 'Chỉ số sức khỏe',
      icon: Gauge,
      description: 'Nước, sáng, lá, chăm sóc',
    },
    {
      id: 'reminders',
      label: 'Cảnh báo & nhắc nhở',
      icon: BellRing,
      description: 'Tưới, bón & cấp cứu',
      badge: pendingAlertsCount > 0 ? pendingAlertsCount : undefined,
    },
    {
      id: 'care-plan',
      label: 'Kế hoạch chăm sóc',
      icon: CalendarCheck2,
      description: 'Lộ trình AI cá nhân hóa',
    },
    {
      id: 'ai-doctor',
      label: 'Hỏi AI Bác Sĩ',
      icon: Bot,
      description: 'Chẩn đoán & cấp cứu cây',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      {/* Top Zone: Clean Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-50 flex items-center justify-center shadow-sm">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-900 font-serif-title">
                  Cứu Cây
                </span>
                <span className="text-xs text-stone-400 font-normal hidden sm:inline">
                  · Chăm Sóc & Cấp Cứu Cây Trồng
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Đang theo dõi {plantCount} cây trồng
              </p>
            </div>
          </div>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Sound Mute/Unmute Toggle Button */}
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                title={soundEnabled ? 'Âm thanh thông báo: Đang BẬT (Bấm để tắt)' : 'Âm thanh thông báo: Đang TẮT (Bấm để bật)'}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                  soundEnabled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200 hover:text-stone-600'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={() => onTabChange('ai-doctor')}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ai-doctor'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-700" />
              <span className="hidden xs:inline">Khám cây với AI</span>
              <span className="xs:hidden">Hỏi AI</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Cây Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide bar: Overhead functional navigation bar */}
      <div className="bg-stone-50/90 border-t border-stone-200/80 px-2 sm:px-6 relative">
        <div className="max-w-7xl mx-auto relative flex items-center">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            aria-label="Cuộn trái"
            className="hidden md:flex absolute left-0 z-10 w-7 h-7 rounded-full bg-white border border-stone-300 shadow-sm items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors -ml-3"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slide Bar Container */}
          <div
            ref={scrollRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2 px-1 w-full scroll-smooth"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-700' : 'text-stone-400 group-hover:text-stone-700'
                    }`}
                  />
                  <span>{tab.label}</span>

                  {tab.badge && tab.badge > 0 ? (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center leading-none">
                      {tab.badge}
                    </span>
                  ) : null}

                  {/* Active bottom accent bar */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            aria-label="Cuộn phải"
            className="hidden md:flex absolute right-0 z-10 w-7 h-7 rounded-full bg-white border border-stone-300 shadow-sm items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors -mr-3"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
