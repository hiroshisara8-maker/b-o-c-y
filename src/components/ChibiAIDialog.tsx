import React, { useEffect } from 'react';
import { Plant, HealthLog } from '../types/plant';
import { X, Droplet, Sun, Heart, Sparkles, AlertTriangle, ShieldCheck, Stethoscope, ArrowRight } from 'lucide-react';
import { ChibiPlantAvatar } from './ChibiPlantAvatar';

interface ChibiAIDialogProps {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDoctorTab?: () => void;
  onOpenNewLogModal?: () => void;
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

  const score = plant.healthScore ?? 85;
  const latestLog = plant.healthLogs?.[plant.healthLogs.length - 1];

  let diagnosisText = '';
  let tips: { icon: string; title: string; desc: string }[] = [];

  if (score >= 80) {
    diagnosisText = `Chào bạn! Mình là ${plant.name}. Cảm ơn bạn nhiều lắm, hiện tại mình cảm thấy cực kỳ sảng khoái và tràn đầy năng lượng! Tán lá xanh bóng mượt mà, rễ hô hấp rất tốt trong giá thể ${plant.soilType.toLowerCase()}.`;
    tips = [
      {
        icon: '🌿',
        title: 'Duy trì phong độ',
        desc: `Tiếp tục tưới định kỳ mỗi ${plant.waterCycleDays} ngày một lần, để đất hơi se khô trước lần tưới kế tiếp.`
      },
      {
        icon: '☀️',
        title: 'Ánh sáng lý tưởng',
        desc: `Vị trí tại ${plant.location} đang cung cấp đủ ${plant.sunlight.toLowerCase()} cho mình quang hợp.`
      },
      {
        icon: '✨',
        title: 'Mẹo nhỏ từ Bé',
        desc: 'Thỉnh thoảng lau nhẹ bụi bám trên mặt lá bằng khăn ẩm mềm để mình hít thở dễ dàng hơn nhé!'
      }
    ];
  } else if (score >= 60) {
    diagnosisText = `Chào bạn! Mình là ${plant.name}. Sức khỏe của mình đang ở mức khá ổn, nhưng hôm nay mình thấy hơi khát nước hoặc vị trí hiện tại đang hơi thiếu sáng một chút đó!`;
    tips = [
      {
        icon: '💧',
        title: 'Kiểm tra độ ẩm đất',
        desc: 'Cắm ngón tay khoảng 2 đốt xuống đất, nếu thấy đất khô ráo thì hãy tưới đẫm nước cho mình nhé!'
      },
      {
        icon: '🌤️',
        title: 'Điều chỉnh ánh sáng',
        desc: `Mình thích ${plant.sunlight.toLowerCase()}, hãy tránh để nắng gắt buổi trưa chiếu thẳng vào lá gây cháy nhé.`
      }
    ];
  } else {
    diagnosisText = `Ôi bạn ơi! Mình cảm thấy rất mệt... Tình trạng sức khỏe của mình đang ở mức báo động (${score}%). Lá mình có dấu hiệu vàng rũ, hoặc rễ đang bị ngạt úng do đọng nước quá lâu!`;
    tips = [
      {
        icon: '🚨',
        title: 'Cần kiểm tra rễ khẩn cấp',
        desc: 'Kiểm tra lỗ thoát nước đáy chậu xem có bị bít tắc không. Nếu đất ngập sũng, tạm ngừng tưới ngay!'
      },
      {
        icon: '🩺',
        title: 'Hỏi Bác Sĩ Cây Trồng AI',
        desc: 'Chụp ảnh lá hoặc thân cây và gửi vào mục "Bác Sĩ AI" để nhận phác đồ cấp cứu kịp thời!'
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
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 my-8 animate-fadeIn relative">
        {/* Close Button Top Right */}
        <button
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
              {plant.name}
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                score >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : score >= 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {score}% Sức Khỏe
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 italic">
            {plant.species}
          </p>
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
              <span className="text-base shrink-0">{tip.icon}</span>
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
              onClick={() => {
                onClose();
                onOpenNewLogModal();
              }}
              className="flex-1 py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors text-center cursor-pointer"
            >
              📸 Ghi Nhật Ký Ảnh Mới
            </button>
          )}

          {score < 70 && onOpenDoctorTab && (
            <button
              onClick={() => {
                onClose();
                onOpenDoctorTab();
              }}
              className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-amber-700" />
              <span>Hỏi Bác Sĩ AI</span>
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
