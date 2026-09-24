import React, { useState } from 'react';
import { Plant, HealthLog } from '../types/plant';
import { Sparkles, Droplet, Sun, Heart, AlertTriangle, ShieldCheck, MessageCircle } from 'lucide-react';
import { playSparkleSound, playWaterSound } from '../utils/audio';

interface ChibiPlantAvatarProps {
  plant: Plant;
  latestLog?: HealthLog;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  interactive?: boolean;
  onOpenDialog?: () => void;
  className?: string;
}

export const ChibiPlantAvatar: React.FC<ChibiPlantAvatarProps> = ({
  plant,
  latestLog,
  size = 'md',
  showSpeechBubble = true,
  interactive = true,
  onOpenDialog,
  className = '',
}) => {
  const [isWiggling, setIsWiggling] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const healthScore = plant?.healthScore ?? 85;
  const safeId = plant?.id ? plant.id.replace(/[^a-zA-Z0-9_-]/g, '_') : 'plant-default';
  const plantName = plant?.name || 'Bé Cây';
  const status = plant?.status || (healthScore >= 80 ? 'healthy' : healthScore >= 50 ? 'warning' : 'critical');

  // Determine emotional state and quotes
  let mood: 'happy' | 'cheerful' | 'thirsty' | 'sick' = 'happy';
  if (healthScore >= 80) {
    mood = 'happy';
  } else if (healthScore >= 65) {
    mood = 'cheerful';
  } else if (healthScore >= 45) {
    mood = 'thirsty';
  } else {
    mood = 'sick';
  }

  const quotes = {
    happy: [
      `Mình đang cực kỳ sung sức! Lá xanh bóng và rễ thở rất thoải mái! ✨`,
      `Cảm ơn bạn đã chăm sóc mình chu đáo mỗi ngày nha! 💚`,
      `Tán lá của mình đang quang hợp rất tốt đó bạn ơi! 🌿`,
      `Hôm nay trời đẹp quá, mình cảm thấy tràn trề sinh khí! ☀️`
    ],
    cheerful: [
      `Mình đang lớn lên từng ngày! Đừng quên xoay chậu nhẹ nhàng để tán lá nhận đều nắng nha. 🌱`,
      `Đất của mình độ ẩm vừa vặn, hôm nay là một ngày tuyệt vời! 💧`,
      `Đang có mầm lá mới chuẩn bị nhú ra đó, hãy chờ xem nhé! ✨`
    ],
    thirsty: [
      `Khát nước quá bạn ơi! Đất dưới chân mình khô rồi, cho mình xin một ngụm nước nhé! 💧😥`,
      `Lá mình hơi rũ nhẹ một chút rồi, nhớ ghé tưới giúp mình nha bạn ơi! 🥺`,
      `Thời tiết hơi hanh khô, hãy xịt phun sương nhẹ cho lá mình mát nha! 💦`
    ],
    sick: [
      `Cứu mình với! Mình cảm thấy mệt và lá đang có dấu hiệu vàng úng... 🩹`,
      `Rễ của mình hơi bí hoặc bị úng nước rồi, bạn kiểm tra chậu giúp mình với! 🆘`,
      `Hãy mở Bác Sĩ AI để chuẩn đoán và cứu mình sớm nhé bạn! 🩺`
    ]
  };

  const currentQuotes = quotes[mood];
  const activeQuote = currentQuotes[quoteIndex % currentQuotes.length];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;

    setIsWiggling(true);
    setQuoteIndex((prev) => prev + 1);

    if (mood === 'thirsty') {
      playWaterSound();
    } else {
      playSparkleSound();
    }

    setTimeout(() => setIsWiggling(false), 800);

    if (onOpenDialog) {
      onOpenDialog();
    }
  };

  // Dimension helpers
  const dimensions = {
    sm: { box: 'w-12 h-12', svg: 48, text: 'text-[10px]' },
    md: { box: 'w-20 h-20', svg: 80, text: 'text-xs' },
    lg: { box: 'w-28 h-28', svg: 112, text: 'text-xs' },
    xl: { box: 'w-36 h-36', svg: 144, text: 'text-sm' }
  }[size];

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div
          onClick={handleClick}
          className="mb-2 max-w-[240px] sm:max-w-[280px] bg-white border border-stone-200 shadow-md rounded-2xl px-3 py-2 text-stone-800 text-[11px] sm:text-xs relative cursor-pointer hover:border-emerald-400 hover:shadow-lg transition-all group animate-fadeIn"
        >
          <div className="flex items-start gap-1.5">
            <span className="text-sm shrink-0">
              {mood === 'happy' ? '💖' : mood === 'cheerful' ? '🌱' : mood === 'thirsty' ? '💧' : '🩹'}
            </span>
            <p className="leading-snug font-medium text-stone-700 select-none">
              {activeQuote}
            </p>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-stone-200 rotate-45" />
          <span className="text-[9px] text-stone-400 block text-right mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Nhấp để nghe câu khác 💬
          </span>
        </div>
      )}

      {/* Chibi Character SVG */}
      <div
        onClick={handleClick}
        className={`relative ${dimensions.box} cursor-pointer select-none transition-transform duration-300 ${
          isWiggling ? 'animate-bounce scale-110' : 'hover:scale-105'
        }`}
        title={`Bé ${plantName}: ${healthScore}% Sức khỏe - Nhấp để tương tác`}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <radialGradient id={`glow-${safeId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`leafGrad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={mood === 'sick' ? '#eab308' : mood === 'thirsty' ? '#84cc16' : '#22c55e'} />
              <stop offset="100%" stopColor={mood === 'sick' ? '#ca8a04' : mood === 'thirsty' ? '#4d7c0f' : '#15803d'} />
            </linearGradient>
            <linearGradient id={`potGrad-${safeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="60" cy="60" r="54" fill={`url(#glow-${safeId})`} />

          {/* Sparkles / Particles for happy state */}
          {mood === 'happy' && (
            <>
              <path
                d="M 22 28 Q 24 22 30 22 Q 24 22 22 16 Q 22 22 16 22 Q 22 22 22 28 Z"
                fill="#facc15"
                className="animate-pulse"
              />
              <path
                d="M 98 32 Q 100 28 104 28 Q 100 28 98 24 Q 98 28 94 28 Q 98 28 98 32 Z"
                fill="#38bdf8"
                className="animate-pulse"
              />
              <circle cx="104" cy="50" r="3" fill="#f43f5e" className="animate-ping" />
            </>
          )}

          {/* Sweat drop for thirsty / sick */}
          {(mood === 'thirsty' || mood === 'sick') && (
            <path
              d="M 92 48 C 92 48 98 56 98 60 C 98 63 95 66 92 66 C 89 66 86 63 86 60 C 86 56 92 48 92 48 Z"
              fill="#38bdf8"
              className="animate-bounce"
            />
          )}

          {/* Bandage on leaf for sick state */}
          {mood === 'sick' && (
            <g transform="translate(38, 22) rotate(-18)">
              <rect x="0" y="0" width="16" height="8" rx="2" fill="#fed7aa" stroke="#fb923c" strokeWidth="1" />
              <line x1="8" y1="2" x2="8" y2="6" stroke="#f43f5e" strokeWidth="1.5" />
              <line x1="5" y1="4" x2="11" y2="4" stroke="#f43f5e" strokeWidth="1.5" />
            </g>
          )}

          {/* PLANT STEM & LEAVES */}
          <g>
            {/* Main Central Stem */}
            <path
              d="M 60 76 Q 60 48 60 30"
              stroke="#15803d"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Left Leaf */}
            <path
              d={
                mood === 'sick' || mood === 'thirsty'
                  ? 'M 58 54 Q 30 52 24 66 Q 36 74 58 62 Z' // Drooping down
                  : 'M 58 54 Q 26 40 28 22 Q 46 28 58 48 Z' // Perky up
              }
              fill={`url(#leafGrad-${plant.id})`}
              stroke="#166534"
              strokeWidth="1.5"
            />
            {/* Left Leaf rib */}
            <path
              d={
                mood === 'sick' || mood === 'thirsty'
                  ? 'M 58 56 Q 40 58 28 64'
                  : 'M 58 50 Q 40 38 32 26'
              }
              stroke="#bbf7d0"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Right Leaf */}
            <path
              d={
                mood === 'sick'
                  ? 'M 62 50 Q 88 52 94 68 Q 80 74 62 58 Z' // Drooping down
                  : 'M 62 50 Q 94 36 92 18 Q 74 26 62 44 Z' // Perky up
              }
              fill={`url(#leafGrad-${plant.id})`}
              stroke="#166534"
              strokeWidth="1.5"
            />
            {/* Right Leaf rib */}
            <path
              d={
                mood === 'sick'
                  ? 'M 62 52 Q 78 56 90 64'
                  : 'M 62 46 Q 80 34 88 22'
              }
              stroke="#bbf7d0"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Center Top Sprout or Flower */}
            <path
              d="M 60 32 Q 48 12 60 6 Q 72 12 60 32 Z"
              fill={`url(#leafGrad-${plant.id})`}
              stroke="#166534"
              strokeWidth="1.5"
            />
          </g>

          {/* CHIBI POT (Cute Body) */}
          <g>
            {/* Pot Rim */}
            <rect
              x="30"
              y="68"
              width="60"
              height="12"
              rx="4"
              fill="#fb923c"
              stroke="#c2410c"
              strokeWidth="2"
            />
            {/* Pot Base Body */}
            <path
              d="M 34 78 L 40 108 C 41 112 45 114 50 114 L 70 114 C 75 114 79 112 80 108 L 86 78 Z"
              fill={`url(#potGrad-${plant.id})`}
              stroke="#c2410c"
              strokeWidth="2"
            />

            {/* Cute Rosy Cheeks */}
            <circle
              cx="45"
              cy="95"
              r="4"
              fill={mood === 'happy' ? '#fda4af' : '#fecdd3'}
              opacity="0.8"
            />
            <circle
              cx="75"
              cy="95"
              r="4"
              fill={mood === 'happy' ? '#fda4af' : '#fecdd3'}
              opacity="0.8"
            />

            {/* EYES */}
            {mood === 'happy' && (
              <>
                {/* Cheerful curved eye arches ^ ^ */}
                <path
                  d="M 46 90 Q 51 83 56 90"
                  stroke="#1c1917"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 64 90 Q 69 83 74 90"
                  stroke="#1c1917"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            )}

            {mood === 'cheerful' && (
              <>
                {/* Big shiny round eyes */}
                <circle cx="51" cy="89" r="4" fill="#1c1917" />
                <circle cx="52.5" cy="87.5" r="1.5" fill="#ffffff" />
                <circle cx="69" cy="89" r="4" fill="#1c1917" />
                <circle cx="70.5" cy="87.5" r="1.5" fill="#ffffff" />
              </>
            )}

            {mood === 'thirsty' && (
              <>
                {/* Pleading oval eyes */}
                <ellipse cx="51" cy="90" rx="4" ry="5" fill="#1c1917" />
                <circle cx="52.5" cy="88" r="2" fill="#ffffff" />
                <ellipse cx="69" cy="90" rx="4" ry="5" fill="#1c1917" />
                <circle cx="70.5" cy="88" r="2" fill="#ffffff" />
                {/* Slight sad brow */}
                <path d="M 47 84 Q 51 86 55 84" stroke="#78716c" strokeWidth="1.5" fill="none" />
                <path d="M 65 84 Q 69 86 73 84" stroke="#78716c" strokeWidth="1.5" fill="none" />
              </>
            )}

            {mood === 'sick' && (
              <>
                {/* Dizzy swirls or sad eyes */}
                <path d="M 47 86 L 55 92" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 47 92 L 55 86" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 65 86 L 73 92" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 65 92 L 73 86" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}

            {/* MOUTH */}
            {mood === 'happy' && (
              <path
                d="M 55 96 Q 60 102 65 96"
                stroke="#1c1917"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="#f43f5e"
              />
            )}
            {mood === 'cheerful' && (
              <path
                d="M 56 96 Q 60 100 64 96"
                stroke="#1c1917"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
            {mood === 'thirsty' && (
              <circle cx="60" cy="98" r="2.5" fill="#1c1917" />
            )}
            {mood === 'sick' && (
              <path
                d="M 55 99 Q 60 95 65 99"
                stroke="#1c1917"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Mini cute Pot Feet */}
            <rect x="44" y="114" width="6" height="2.5" rx="1" fill="#9a3412" />
            <rect x="70" y="114" width="6" height="2.5" rx="1" fill="#9a3412" />
          </g>
        </svg>

        {/* Small floating health badge */}
        <div
          className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs border ${
            healthScore >= 80
              ? 'bg-emerald-500 text-white border-emerald-600'
              : healthScore >= 50
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-rose-500 text-white border-rose-600'
          }`}
        >
          {healthScore}%
        </div>
      </div>

      {/* Mood status label */}
      <div className="mt-1 flex items-center gap-1">
        <span
          className={`w-2 h-2 rounded-full ${
            mood === 'happy'
              ? 'bg-emerald-500 animate-pulse'
              : mood === 'cheerful'
              ? 'bg-emerald-400'
              : mood === 'thirsty'
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
        />
        <span className="text-[11px] font-medium text-stone-600">
          {mood === 'happy'
            ? 'Rất Vui Vẻ'
            : mood === 'cheerful'
            ? 'Khỏe Mạnh'
            : mood === 'thirsty'
            ? 'Hơi Khát Nước'
            : 'Cần Cấp Cứu'}
        </span>
      </div>
    </div>
  );
};
