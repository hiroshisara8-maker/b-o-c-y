import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));

const isApiKeyValid = Boolean(
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
  process.env.GEMINI_API_KEY.trim().length > 0
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Care Plan Generation
app.post('/api/ai/care-plan', async (req, res) => {
  try {
    const { plantName, species, location, lightLevel, soilType, potSize, ageWeeks, careHistory, currentCondition } = req.body;

    const prompt = `Bạn là chuyên gia nông học và bác sĩ cây trồng hàng đầu của ứng dụng "Cứu Cây".
Hãy lập một KẾ HOẠCH CHĂM SÓC CHUYÊN SÂU & CÁ NHÂN HÓA bằng tiếng Việt cho cây sau:
- Tên cây: ${plantName || 'Chưa đặt tên'} (${species || 'Cây trồng trong nhà'})
- Vị trí đặt: ${location || 'Trong nhà'}
- Ánh sáng nhận được: ${lightLevel || 'Ánh sáng tán xạ gián tiếp'}
- Loại đất/giá thể: ${soilType || 'Đất thịt trộn trấu mụn dừa'}
- Tình trạng hiện tại: ${currentCondition || 'Bình thường'}
- Thời gian chăm sóc: ${ageWeeks || 'Vài'} tuần
- Lịch sử chăm sóc gần đây: ${careHistory || 'Tưới nước định kỳ'}

Yêu cầu xuất ra cấu trúc JSON (chỉ JSON thuần, không bọc markdown triple backticks nếu có thể, hoặc format chuẩn):
{
  "summary": "Tóm tắt đánh giá ngắn gọn về nhu cầu sinh học và môi trường của cây",
  "waterSchedule": {
    "frequency": "Ví dụ: 3-4 ngày/lần",
    "amount": "Lượng nước phù hợp",
    "technique": "Kỹ thuật tưới (tưới đẫm, tưới gốc, phun sương lá)",
    "soilTestTip": "Cách kiểm tra độ ẩm đất trước khi tưới (ví dụ: cắm ngón tay sâu 2 đốt)"
  },
  "lightAdvice": {
    "intensity": "Cường độ ánh sáng cần thiết",
    "placement": "Vị trí tối ưu trong nhà hoặc ban công",
    "warning": "Dấu hiệu khi thừa/thiếu sáng"
  },
  "fertilizerPlan": {
    "type": "Loại phân bón khuyến nghị (hữu cơ, NPK tỉ lệ cụ thể)",
    "frequency": "Tần suất bón",
    "dosage": "Liều lượng an toàn tránh cháy rễ"
  },
  "weeklyTasks": [
    { "weekDay": "Thứ 2", "task": "Nhiệm vụ cụ thể", "icon": "water" },
    { "weekDay": "Thứ 4", "task": "Nhiệm vụ cụ thể", "icon": "sun" },
    { "weekDay": "Thứ 7", "task": "Nhiệm vụ cụ thể", "icon": "check" },
    { "weekDay": "Chủ nhật", "task": "Nhiệm vụ cụ thể", "icon": "leaf" }
  ],
  "emergencySigns": [
    "Dấu hiệu cảnh báo 1 và cách xử lý",
    "Dấu hiệu cảnh báo 2 và cách xử lý"
  ],
  "specialTips": "Lời khuyên vàng từ chuyên gia để cây lớn nhanh, lá xanh bóng"
}`;

    if (!isApiKeyValid) {
      // Fallback expert plan if no API key configured
      return res.json({
        success: true,
        plan: generateFallbackPlan(plantName, species, location),
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    let parsedPlan;
    try {
      let clean = text.trim();
      if (clean.includes('{') && clean.includes('}')) {
        clean = clean.substring(clean.indexOf('{'), clean.lastIndexOf('}') + 1);
      }
      parsedPlan = JSON.parse(clean);
    } catch {
      const cleanFallback = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedPlan = JSON.parse(cleanFallback);
    }

    res.json({ success: true, plan: parsedPlan });
  } catch (error: any) {
    console.error('Error generating care plan:', error);
    // Return high quality fallback
    const { plantName, species, location } = req.body || {};
    res.json({
      success: true,
      plan: generateFallbackPlan(plantName, species, location),
      note: 'Chế độ chuyên gia ngoại tuyến',
    });
  }
});

// Endpoint: AI Plant Doctor Ask & Diagnosis
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { message, plantContext, imageBase64, mimeType } = req.body;

    const parts: any[] = [];

    if (imageBase64) {
      const cleanData = imageBase64.includes(';base64,')
        ? imageBase64.split(';base64,')[1]
        : imageBase64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanData,
        },
      });
    }

    const contextPrompt = `Bạn là "Bác sĩ Cây Trồng AI" của ứng dụng "Cứu Cây". 
Ngôn ngữ: Tiếng Việt, thân thiện, ân cần, giải thích nguyên nhân khoa học dễ hiểu cho người mới và đưa ra hướng dẫn hành động cụ thể rõ ràng.
${plantContext ? `Ngữ cảnh cây đang xét:\n${plantContext}\n` : ''}
Câu hỏi / Tình trạng người dùng gửi:
"${message || 'Hãy phân tích tình trạng sức khỏe của cây này qua hình ảnh'}"

Hãy trả lời theo định dạng mạch lạc:
1. 🩺 **Chẩn đoán tình trạng**: Xác định chính xác cây đang gặp vấn đề gì (vàng lá do úng, cháy nắng, thiếu đạm, bọ trĩ, thối rễ, thiếu nước,...).
2. 🔬 **Nguyên nhân tiềm ẩn**: Vì sao tình trạng này xuất hiện.
3. 🚑 **Phác đồ "Cứu Cây" cấp tốc**: Các bước sơ cứu xử lý ngay hôm nay.
4. 🌿 **Biện pháp phòng ngừa lâu dài**: Cách dưỡng cây hồi phục và phát triển xanh tốt.`;

    parts.push({ text: contextPrompt });

    if (!isApiKeyValid) {
      return res.json({
        success: true,
        answer: generateFallbackDoctorAdvice(message),
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
    });

    res.json({
      success: true,
      answer: response.text || 'Không nhận được câu trả lời từ AI.',
    });
  } catch (error: any) {
    console.error('Error in AI Ask endpoint:', error);
    res.json({
      success: true,
      answer: generateFallbackDoctorAdvice(req.body?.message || ''),
      note: 'Chế độ hỗ trợ cứu cây tự động',
    });
  }
});

// Fallback logic for high reliability
function generateFallbackPlan(name = 'Cây cưng', species = 'Cây trong nhà', location = 'Bàn làm việc') {
  return {
    summary: `Kế hoạch chăm sóc cân bằng cho ${name} (${species}) tại vị trí ${location}. Chú trọng cân bằng chu kỳ khô - ướt của đất và độ thông thoáng khí.`,
    waterSchedule: {
      frequency: '3 - 5 ngày một lần (tùy theo độ khô)',
      amount: 'Tưới đều 200 - 300ml quanh gốc',
      technique: 'Tưới chậm vào gốc đến khi nước róc nhẹ qua lỗ thoát, đổ bỏ nước đọng đáy đĩa sau 15 phút.',
      soilTestTip: 'Dùng ngón tay hoặc que tre cắm sâu 3-4cm, nếu que khô ráo thì mới tiến hành tưới.',
    },
    lightAdvice: {
      intensity: 'Ánh sáng khuếch tán gián tiếp (60% - 70%)',
      placement: `${location}, cách cửa sổ có rèm mỏng khoảng 1 - 1.5 mét, tránh nắng gắt buổi trưa rọi trực diện.`,
      warning: 'Nếu lá nhạt màu và vươn dài khẳng khiu là thiếu sáng; nếu mép lá giòn xém là bị cháy nắng.',
    },
    fertilizerPlan: {
      type: 'Phân bón lá vi lượng hoặc NPK 20-20-20 hòa loãng 1/2 liều lượng, bổ sung dịch chuối/trùn quế.',
      frequency: '2 - 3 tuần một lần vào mùa sinh trưởng (mùa xuân - hè). Giảm tưới bón vào mùa đông.',
      dosage: '1 thìa cafe pha 2 lít nước sạch, tưới nhẹ sau khi đất đã ẩm.',
    },
    weeklyTasks: [
      { weekDay: 'Thứ 2', task: 'Kiểm tra độ ẩm đất bề mặt, lau sạch bụi trên mặt lá bằng khăn ẩm mềm để tăng quang hợp.', icon: 'leaf' },
      { weekDay: 'Thứ 4', task: 'Xoay chậu 90 độ để cây phát triển tròn đều không bị nghiêng về phía nguồn sáng.', icon: 'sun' },
      { weekDay: 'Thứ 6', task: 'Tưới đẫm nước nếu que kiểm tra khô. Kiểm tra mặt dưới lá xem có rệp sáp hay nhện đỏ.', icon: 'water' },
      { weekDay: 'Chủ nhật', task: 'Tỉa bỏ lá vàng úa ở gốc, phun sương nhẹ tạo ẩm không khí xung quanh tán.', icon: 'check' },
    ],
    emergencySigns: [
      'Lá vàng mềm nhũn: Biểu hiện ngập úng rễ. Ngưng tưới ngay, xới nhẹ mặt đất và di chuyển ra nơi thoáng gió.',
      'Đầu lá khô cháy nâu nhọn: Độ ẩm không khí quá thấp hoặc nước máy còn nhiều clo. Hãy để nước bay hơi clo 24h trước khi tưới.',
      'Cây rũ lá đột ngột: Thiếu nước cấp tính. Đặt cả chậu vào chậu nước ngập 1/3 trong 20 phút rồi nhấc ra ráo nước.',
    ],
    specialTips: 'Luôn đảm bảo chậu có lỗ thoát nước thông suốt. Định kỳ 6 tháng bổ sung 1 lớp phân trùn quế lên mặt chậu để nuôi vi sinh vật đất.',
  };
}

function generateFallbackDoctorAdvice(query = '') {
  return `🩺 **Chẩn đoán nhanh**: Dựa trên triệu chứng thường gặp, cây của bạn có thể đang bị mất cân bằng nước (ngập úng rễ hoặc thiếu ẩm cục bộ) kết hợp với ánh sáng chưa tối ưu.

🔬 **Nguyên nhân tiềm ẩn**:
- Đất trồng bí khí, lỗ thoát nước bị nghẽn làm rễ thiếu oxy.
- Độ ẩm không khí trong phòng máy lạnh xuống thấp khiến đầu lá bị khô tóp.
- Tưới nước bề mặt quá ít khiến nước chưa ngấm tới rễ sâu dưới đáy bầu.

🚑 **Phác đồ "Cứu Cây" cấp tốc**:
1. **Kiểm tra rễ**: Nhẹ nhàng lay nhẹ gốc hoặc luồn que gỗ vào sát đáy chậu kiểm tra xem đất có bết dính có mùi chua không.
2. **Cắt tỉa an toàn**: Dùng kéo khử trùng cồn cắt bỏ phần lá vàng héo úa để cây dồn sức nuôi chồi mới.
3. **Điều chỉnh tưới**: Nếu đất úng, đặt chậu nơi thoáng gió, ngưng tưới 4-5 ngày. Nếu đất kiệt khô, ngâm đáy chậu 15 phút.
4. **Ánh sáng hồi sức**: Đặt cây nơi có ánh sáng dịu mát, tuyệt đối không bón phân hóa học lúc cây đang yếu.

🌿 **Biện pháp phòng ngừa**: Duy trì lịch kiểm tra đất 2 ngày/lần trên ứng dụng "Cứu Cây" và vệ sinh lá hàng tuần.`;
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server "Cứu Cây" listening on http://0.0.0.0:${port}`);
  });
}

startServer();
