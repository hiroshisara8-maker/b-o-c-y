import React, { useEffect } from 'react';
import { Plant, HealthLog } from '../types/plant';
import {
  X,
  Droplet,
  Sun,
  Heart,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { ChibiPlantAvatar } from './ChibiPlantAvatar';

interface ChibiAIDialogProps {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDoctorTab?: () => void;
  onOpenNewLogModal?: () => void;
}

interface CareTip {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
}

export const ChibiAIDialog: React.FC<ChibiAIDialogProps> = ({
  plant,
  isOpen,
  onClose,
  onOpenDoctorTab,
  onOpenNewLogModal,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !plant) return null;

  // Safe fallback extractions to prevent undefined.toLowerCase() crashes
  const plantName = plant.name || 'Bé Cây';
  const plantSpecies = plant.species || 'Cây cảnh trong nhà';
  const soilTypeDesc = (plant.soilType || 'đất hữu cơ tơi xốp').toLowerCase();
  const sunlightDesc = (plant.sunlight || 'ánh sáng gián tiếp').toLowerCase();
  const locationDesc = plant.location || 'trong nhà';
  const waterCycle = plant.waterCycleDays || 4;
  const score = plant.healthScore ?? 85;
  const latestLog: HealthLog | undefined = plant.healthLogs?.[plant.healthLogs.length - 1];

  let diagnosisText = '';
  let tips: CareTip[] = [];

  if (score >= 80) {
    diagnosisText = `Chào bạn! Mình là ${plantName}. Cảm ơn bạn nhiều lắm, hiện tại mình cảm thấy cực kỳ sảng khoái và tràn đầy năng lượng! Tán lá xanh bóng mượt mà, rễ hô hấp rất tốt trong giá thể ${soilTypeDesc}.`;
    tips = [
      {
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Duy trì phong độ',
        desc: `Tiếp tục tưới định kỳ mỗi ${waterCycle} ngày một lần, để đất hơi se khô trước lần tưới kế tiếp.`
      },
      {
        icon: <Sun className="w-4 h-4 text-amber-500" />,
        iconBg: 'bg-amber-100',
        title: 'Ánh sáng lý tưởng',
        desc: `Vị trí tại ${locationDesc} đang cung cấp đủ ${sunlightDesc} cho mình quang hợp.`
      },
      {
        icon: <Droplet className="w-4 h-4 text-sky-500" />,
        iconBg: 'bg-sky-100',
        title: 'Cấp ẩm vừa đủ',
        desc: 'Độ ẩm đất hiện tại rất phù hợp, hãy duy trì nhịp tưới đều đặn và tránh tưới vào buổi trưa nắng gắt.'
      },
      {
        icon: <Sparkles className="w-4 h-4 text-purple-500" />,
        iconBg: 'bg-purple-100',
        title: 'Mẹo nhỏ từ Bé',
        desc: 'Thỉnh thoảng lau nhẹ bụi bám trên mặt lá bằng khăn ẩm mềm để mình hít thở dễ dàng hơn nhé!'
      }
    ];
  } else if (score >= 60) {
    diagnosisText = `Chào bạn! Mình là ${plantName}. Sức khỏe của mình đang ở mức khá ổn, nhưng hôm nay mình thấy hơi khát nước hoặc vị trí hiện tại đang hơi thiếu sáng một chút đó!`;
    tips = [
      {
        icon: <Droplet className="w-4 h-4 text-sky-500" />,
        iconBg: 'bg-sky-100',
        title: 'Kiểm tra độ ẩm đất',
        desc: 'Cắm ngón tay khoảng 2 đốt xuống đất, nếu thấy đất khô ráo thì hãy tưới đẫm nước cho mình nhé!'
      },
      {
        icon: <Sun className="w-4 h-4 text-amber-500" />,
        iconBg: 'bg-amber-100',
        title: 'Điều chỉnh ánh sáng',
        desc: `Mình thích ${sunlightDesc}, hãy tránh để nắng gắt buổi trưa chiếu thẳng vào lá gây cháy nhé.`
      },
      {
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Bảo vệ bộ rễ',
        desc: 'Đảm bảo khay hứng nước không bị tù đọng sau khi tưới để rễ cây không bị ngộp thở.'
      }
    ];
  } else {
    diagnosisText = `Ôi bạn ơi! Mình cảm thấy rất mệt... Tình trạng sức khỏe của mình đang ở mức báo động (${score}%). Lá mình có dấu hiệu vàng rũ, hoặc rễ đang bị ngạt úng do đọng nước quá lâu!`;
    tips = [
      {
        icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
        iconBg: 'bg-rose-100',
        title: 'Cần kiểm tra rễ khẩn cấp',
        desc: 'Kiểm tra lỗ thoát nước đáy chậu xem có bị bít tắc không. Nếu đất ngập sũng, tạm ngừng tưới ngay!'
      },
      {
        icon: <Stethoscope className="w-4 h-4 text-amber-700" />,
        iconBg: 'bg-amber-100',
        title: 'Hỏi Bác Sĩ Cây Trồng AI',
        desc: 'Chụp ảnh lá hoặc thân cây và gửi vào mục "Bác Sĩ AI" để nhận phác đồ cấp cứu kịp thời!'
      },
      {
        icon: <Droplet className="w-4 h-4 text-sky-600" />,
        iconBg: 'bg-sky-100',
        title: 'Điều tiết nước tưới',
        desc: 'Chỉ tưới khi mặt đất se khô hoàn toàn. Hãy xới nhẹ bề mặt đất để thông thoáng khí.'
      }
    ];
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 my-8 animate-fadeIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 px-2.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
          title="Tắt xem mục này (Esc)"
        >
          <X className="w-4 h-4" />
          <span>Tắt</span>
        </button>

        {/* Header with Chibi AI Character */}
        <div className="text-center pt-2">
          <div className="inline-block p-4 rounded-2xl bg-gradient-to-b from-emerald-50 to-stone-100 border border-emerald-100 mb-3">
            <ChibiPlantAvatar
              plant={plant}
              latestLog={latestLog}
              size="lg"
              showSpeechBubble={false}
              interactive={true}
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 font-serif-title">
              {plantName}
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                score >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : score >= 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              <Heart className="w-3 h-3 fill-current" />
              <span>{score}% Sức Khỏe</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 italic">
            {plantSpecies}
          </p>

          {/* Latest health log highlight if available */}
          {latestLog && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200">
              <span>Tuần {latestLog.weekNumber}: {latestLog.condition} ({latestLog.moisturePercent}% ẩm)</span>
            </div>
          )}
        </div>

        {/* Voice of the Plant */}
        <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 leading-relaxed relative">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tâm sự từ Bé Cây hôm nay:</span>
          </div>
          <p className="text-stone-700 font-medium">"{diagnosisText}"</p>
        </div>

        {/* Recommendations list */}
        <div className="mt-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Lời khuyên chăm sóc tức thì:
          </h3>
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-start gap-2.5 text-xs"
            >
              <div className={`w-7 h-7 rounded-lg ${tip.iconBg} flex items-center justify-center shrink-0`}>
                {tip.icon}
              </div>
              <div>
                <span className="font-bold text-stone-900 block">{tip.title}</span>
                <span className="text-stone-600 mt-0.5 block">{tip.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-2">
          {onOpenNewLogModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewLogModal();
              }}
              className="flex-1 py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>📸 Ghi Nhật Ký Ảnh</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          )}

          {score < 70 && onOpenDoctorTab && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDoctorTab();
              }}
              className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-amber-700" />
              <span>Hỏi Bác Sĩ AI</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700 opacity-80" />
            </button>
          )}

          {/* Explicit Close / Tắt Button */}
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tắt xem</span>
          </button>
        </div>
      </div>
    </div>
  );
};
