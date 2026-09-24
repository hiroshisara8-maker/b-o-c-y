import React, { useState, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Upload, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Stethoscope, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Plant } from '../types/plant';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageUrl?: string;
  timestamp: string;
  plantName?: string;
}

interface AIDoctorTabProps {
  plants: Plant[];
  selectedPlantId: string;
  onSelectPlant: (id: string) => void;
}

export const AIDoctorTab: React.FC<AIDoctorTabProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
}) => {
  const currentPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);

  // Initial greeting message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Xin chào! Tôi là **Bác Sĩ Cây Trồng AI** của ứng dụng Cứu Cây 🩺🌿\n\nBạn có thể gửi hình ảnh chụp cận cảnh lá, gốc, ngọn cây hoặc mô tả triệu chứng bất thường (vàng lá, rũ ngọn, đốm nâu, rệp nấm,...). Tôi sẽ giúp bạn:\n1. 🔍 **Chẩn đoán nguyên nhân** chính xác\n2. 🚑 **Phác đồ sơ cứu cây cấp tốc** từng bước\n3. 🌿 **Cách phòng ngừa** để cây phục hồi xanh tốt!`,
      timestamp: 'Vừa xong',
    },
  ]);

  const quickQuestions = [
    'Lá cây chuyển vàng và mềm nhũn ở gốc, cách xử lý thế nào?',
    'Mép lá xuất hiện đốm nâu khô giòn, cây bị nấm hay thiếu nước?',
    'Cách nhận biết và trị rệp sáp trắng bám nách lá an toàn?',
    'Cây bị sốc khi mới mua về thay chậu, làm sao để hồi sức?',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() && !selectedImage) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      plantName: currentPlant ? currentPlant.name : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    const currentImg = selectedImage;
    const currentMime = imageMimeType;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const plantContext = currentPlant
        ? `Tên cây: ${currentPlant.name}\nLoài: ${currentPlant.species}\nVị trí đặt: ${currentPlant.location}\nĐặc điểm: ${currentPlant.characteristics}\nChu kỳ tưới: ${currentPlant.waterCycleDays} ngày/lần\nTình trạng hiện tại: ${currentPlant.status}`
        : '';

      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          plantContext,
          imageBase64: currentImg,
          mimeType: currentMime,
        }),
      });

      const data = await response.json();
      const aiReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: data.answer || 'Xin lỗi, tôi chưa thể phân tích triệu chứng này.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error(error);
      const fallbackReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `🩺 **Chẩn đoán nhanh**: Cây có thể đang gặp vấn đề úng nước rễ cục bộ hoặc thiếu ánh sáng tự nhiên.\n\n🚑 **Sơ cứu ngay**:\n1. Ngưng tưới nước 3-4 ngày, kiểm tra lỗ thoát nước đáy chậu.\n2. Cắt bỏ các lá thối hỏng để tránh lây lan nấm.\n3. Đặt cây nơi thông thoáng, có ánh sáng tán xạ nhẹ.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple markdown renderer for AI response
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      let formatted = line;
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-sm text-stone-900 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return (
          <p key={idx} className="ml-2 pl-2 border-l-2 border-emerald-600/40 text-xs sm:text-sm my-1 leading-relaxed">
            {line}
          </p>
        );
      }
      return (
        <p key={idx} className="text-xs sm:text-sm my-1 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Trợ Lý Chẩn Đoán & Cấp Cứu Cây Trồng
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-stone-500">
                  Hỗ trợ Gemini 3.8 Flash
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title mt-1">
                Bác Sĩ Cây Trồng AI
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Chẩn đoán bệnh thực vật qua hình ảnh, phân tích nguyên nhân và đưa ra phác đồ cứu cây.
              </p>
            </div>
          </div>

          {/* Plant Context Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-stone-50 p-2 rounded-xl border border-stone-200">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap pl-1">
              Khám cho cây:
            </span>
            <select
              value={currentPlant?.id || ''}
              onChange={(e) => onSelectPlant(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  🌱 {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-stone-50/40">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    isAI
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-700 text-white shadow-xs'
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : 'Bạn'}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 sm:p-5 shadow-xs text-stone-800 ${
                    isAI
                      ? 'bg-white border border-stone-200'
                      : 'bg-emerald-900 text-white'
                  }`}
                >
                  {msg.plantName && (
                    <span
                      className={`text-[11px] font-semibold block mb-1 ${
                        isAI ? 'text-emerald-800' : 'text-emerald-200'
                      }`}
                    >
                      Cây khám: {msg.plantName}
                    </span>
                  )}

                  {msg.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-stone-200 max-h-56 max-w-sm">
                      <img
                        src={msg.imageUrl}
                        alt="Ảnh gửi chẩn đoán"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`space-y-1 ${!isAI ? 'text-white' : ''}`}>
                    {renderFormattedText(msg.text)}
                  </div>

                  <span
                    className={`text-[10px] block mt-2 text-right ${
                      isAI ? 'text-stone-400' : 'text-emerald-200'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center gap-2 text-xs text-stone-600">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Bác Sĩ Cây Trồng AI đang soi triệu chứng & lập phác đồ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-stone-100/70 border-t border-stone-200 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-semibold text-stone-500 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Hỏi nhanh:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-emerald-900 hover:border-emerald-300 text-xs whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Selected Image Preview Bar */}
        {selectedImage && (
          <div className="px-4 py-2 bg-emerald-50/70 border-t border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md overflow-hidden bg-stone-200 border border-stone-300">
                <img
                  src={selectedImage}
                  alt="Ảnh đã chọn"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-emerald-900 font-medium">
                Đã đính kèm ảnh cây để AI quan sát
              </span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-1 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Photo upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Đính kèm ảnh cây cần khám"
              className="p-2.5 rounded-lg border border-stone-300 text-stone-600 hover:text-emerald-800 hover:bg-stone-50 transition-colors cursor-pointer shrink-0"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Message input */}
            <input
              type="text"
              placeholder={`Mô tả triệu chứng của ${currentPlant?.name || 'cây'} hoặc hỏi cách chăm sóc...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Gửi Bác Sĩ</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
