export interface PlantTemplate {
  id: string;
  englishName: string;
  scientificName: string;
  vietnameseName: string;
  aliases: string[];
  category: 'Phổ biến' | 'Kiểng lá' | 'Lọc khí & Dễ trồng' | 'Mọng nước & Sen đá' | 'Hoa cảnh';
  waterCycleDays: number;
  sunlight: 'Ít ánh sáng' | 'Ánh sáng gián tiếp' | 'Ánh sáng trực tiếp' | 'Nắng bán phần';
  soilType: string;
  characteristics: string;
  defaultPlantName: string;
  imageUrl?: string;
  emoji: string;
}

export const PLANT_TEMPLATES: PlantTemplate[] = [
  {
    id: 'monstera-deliciosa',
    englishName: 'Monstera Deliciosa (Swiss Cheese Plant)',
    scientificName: 'Monstera deliciosa Liebm.',
    vietnameseName: 'Trầu bà lá xẻ Nam Mỹ',
    aliases: ['monstera', 'trau ba la xe', 'la xe', 'trau ba nam my', 'swiss cheese', 'rau ba', 'monster'],
    category: 'Kiểng lá',
    waterCycleDays: 4,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Giá thể xơ dừa ngâm + vỏ thông + perlite thoát nước',
    characteristics: 'Thân leo bò, lá to bản xẻ thùy sâu và có lỗ thủng tự nhiên. Cực kỳ nhạy cảm với úng rễ, ưa ẩm không khí cao.',
    defaultPlantName: 'Bé Monstera Lá Xẻ',
    imageUrl: '/images/monstera_deliciosa_1790162091214.jpg',
    emoji: '🌿'
  },
  {
    id: 'snake-plant',
    englishName: 'Snake Plant (Mother-in-law\'s Tongue)',
    scientificName: 'Sansevieria trifasciata / Dracaena trifasciata',
    vietnameseName: 'Cây Lưỡi hổ vằn',
    aliases: ['snake plant', 'sansevieria', 'luoi ho', 'cay luoi ho', 'luoi me chong', 'mother in law', 'ho van'],
    category: 'Lọc khí & Dễ trồng',
    waterCycleDays: 12,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Đất phù sa trộn xỉ than đập vụn + đá pumice khô thoáng',
    characteristics: 'Lá dày mọng nước viền vàng, chịu khô hạn cực tốt. Lọc độc tố benzen, formaldehyde và nhả oxy ban đêm.',
    defaultPlantName: 'Lưỡi Hổ Góc Phòng',
    imageUrl: '/images/snake_plant_1790162110855.jpg',
    emoji: '🐍'
  },
  {
    id: 'fiddle-leaf-fig',
    englishName: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    vietnameseName: 'Cây Bàng Singapore',
    aliases: ['fiddle leaf', 'fig', 'bang singapore', 'cay bang', 'ficus lyrata', 'lyrata', 'bang kieng'],
    category: 'Kiểng lá',
    waterCycleDays: 6,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Đất hữu cơ vi sinh tơi xốp, trộn perlite & trấu hun',
    characteristics: 'Lá to hình đàn violin màu xanh bóng đậm. Cần nhiều ánh sáng tán xạ, ghét gió lùa mạnh và dễ rụng lá khi di chuyển chỗ.',
    defaultPlantName: 'Bàng Singapore Phòng Khách',
    imageUrl: '/images/fiddle_leaf_fig_1790162123651.jpg',
    emoji: '🌳'
  },
  {
    id: 'golden-pothos',
    englishName: 'Golden Pothos (Devil\'s Ivy)',
    scientificName: 'Epipremnum aureum',
    vietnameseName: 'Trầu bà vàng / Vạn niên thanh leo',
    aliases: ['pothos', 'golden pothos', 'trau ba vang', 'trau ba', 'van nien thanh', 'devils ivy', 'epipremnum'],
    category: 'Lọc khí & Dễ trồng',
    waterCycleDays: 4,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Đất mùn dừa trộn tro trấu tơi xốp',
    characteristics: 'Cây thân leo buông rủ mượt mà, lá hình tim có vệt đốm vàng. Cực kỳ dễ sống trong bóng râm hoặc nước thủy sinh.',
    defaultPlantName: 'Trầu Bà Vàng Dây Leo',
    imageUrl: '/images/pothos_trailing_1790162142706.jpg',
    emoji: '🌱'
  },
  {
    id: 'zz-plant',
    englishName: 'ZZ Plant (Zanzibar Gem)',
    scientificName: 'Zamioculcas zamiifolia',
    vietnameseName: 'Cây Kim tiền',
    aliases: ['zz plant', 'zz', 'kim tien', 'cay kim tien', 'kim phat tai', 'zamioculcas', 'zanzibar'],
    category: 'Lọc khí & Dễ trồng',
    waterCycleDays: 14,
    sunlight: 'Ít ánh sáng',
    soilType: 'Đất pha cát, xỉ than thoát nước nhanh',
    characteristics: 'Lá kép bóng dày mỡ màng, củ ngầm trữ nhiều nước. Chịu hạn kiên cường, sống bền bỉ cả trong góc phòng thiếu sáng.',
    defaultPlantName: 'Kim Tiền Phong Thủy',
    emoji: '💰'
  },
  {
    id: 'peace-lily',
    englishName: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    vietnameseName: 'Cây Lan ý (Huệ hòa bình)',
    aliases: ['peace lily', 'lan y', 'cay lan y', 'spathiphyllum', 'hue hoa binh', 'bach mon'],
    category: 'Hoa cảnh',
    waterCycleDays: 3,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Đất phù sa giàu mùn hữu cơ giữ ẩm tốt nhưng thoát nước',
    characteristics: 'Hoa màu trắng muốt hình cánh buồm thanh nhã. Rất nhạy cảm với khô hạn, lá sẽ rũ xuống báo hiệu khi khát nước.',
    defaultPlantName: 'Lan Ý Để Bàn',
    emoji: '🕊️'
  },
  {
    id: 'rubber-tree',
    englishName: 'Rubber Plant (Burgundy / Ficus)',
    scientificName: 'Ficus elastica',
    vietnameseName: 'Đa búp đỏ / Cây Cao su cảnh',
    aliases: ['rubber plant', 'rubber tree', 'da bup do', 'cao su canh', 'ficus elastica', 'bup do'],
    category: 'Kiểng lá',
    waterCycleDays: 7,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Đất thịt nhẹ trộn perlite và phân trùn quế',
    characteristics: 'Búp lá non màu đỏ tươi bao bọc lá mới, phiến lá dày bóng màu mận tím sang trọng. Thích lau sạch bụi mặt lá.',
    defaultPlantName: 'Đa Búp Đỏ Cửa Sổ',
    emoji: '🪴'
  },
  {
    id: 'spider-plant',
    englishName: 'Spider Plant (Airplane Plant)',
    scientificName: 'Chlorophytum comosum',
    vietnameseName: 'Cỏ Lan chi / Dây nhện',
    aliases: ['spider plant', 'lan chi', 'day nhen', 'co lan chi', 'chlorophytum', 'co nhen'],
    category: 'Lọc khí & Dễ trồng',
    waterCycleDays: 5,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Đất thịt pha cát tơi xốp, giàu khoáng',
    characteristics: 'Lá thon dài viền trắng xanh mướt, đẻ nhiều nhánh con rủ xuống như chùm sao. Cực kỳ hiệu quả lọc formaldehyde và xylene.',
    defaultPlantName: 'Lan Chi Rủ Treo Cửa',
    emoji: '🕸️'
  },
  {
    id: 'money-tree',
    englishName: 'Money Tree (Pachira)',
    scientificName: 'Pachira aquatica',
    vietnameseName: 'Cây Kim ngân (Cây Thắt bím)',
    aliases: ['money tree', 'kim ngan', 'cay kim ngan', 'that bim', 'pachira', 'pachira aquatica'],
    category: 'Phổ biến',
    waterCycleDays: 7,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Đất tơi xốp trộn trấu hun và perlite',
    characteristics: 'Thân gỗ bện bím uốn lượn phong thủy, tán 5 lá hình chân vịt tượng trưng ngũ hành cân bằng. Không chịu được tưới ngập gốc.',
    defaultPlantName: 'Kim Ngân Thắt Bím',
    emoji: '🪙'
  },
  {
    id: 'calathea-orbifolia',
    englishName: 'Calathea (Prayer Plant / Peacock)',
    scientificName: 'Calathea orbifolia / Goeppertia',
    vietnameseName: 'Cây Đuôi công lá tròn',
    aliases: ['calathea', 'duoi cong', 'cay duoi cong', 'prayer plant', 'peacock plant', 'goeppertia'],
    category: 'Kiểng lá',
    waterCycleDays: 3,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Giá thể xơ dừa băm + dớn mềm + perlite giữ ẩm',
    characteristics: 'Lá to tròn vân sọc bạc tinh xảo, ban đêm dựng đứng khép lại như bàn tay cầu nguyện (Prayer Plant). Ghét nước máy nhiều clo.',
    defaultPlantName: 'Đuôi Công Cầu Nguyện',
    emoji: '🪶'
  },
  {
    id: 'aloe-vera',
    englishName: 'Aloe Vera',
    scientificName: 'Aloe barbadensis Miller',
    vietnameseName: 'Cây Nha đam / Lô hội',
    aliases: ['aloe vera', 'aloe', 'nha dam', 'lo hoi', 'cay nha dam', 'cay lo hoi'],
    category: 'Mọng nước & Sen đá',
    waterCycleDays: 10,
    sunlight: 'Nắng bán phần',
    soilType: 'Đất cát pha đá perlite sỏi nhỏ thoát nước nhanh',
    characteristics: 'Lá mọng nước chứa gel làm mát và kháng viêm, viền răng cưa nhỏ. Cần nhiều nắng sáng, úng nước là thối rễ ngay.',
    defaultPlantName: 'Nha Đam Chậu Ban Công',
    emoji: '🌵'
  },
  {
    id: 'boston-fern',
    englishName: 'Boston Fern (Sword Fern)',
    scientificName: 'Nephrolepis exaltata',
    vietnameseName: 'Dương xỉ Boston',
    aliases: ['boston fern', 'fern', 'duong xi', 'cay duong xi', 'duong xi boston', 'nephrolepis'],
    category: 'Kiểng lá',
    waterCycleDays: 3,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Mùn dừa tơi xốp trộn rêu sphagnum moss ẩm',
    characteristics: 'Tán lá kim mềm mại cong rủ xanh ngắt, ưa ẩm độ cao 70%+. Thích hợp phun sương cấp ẩm mỗi buổi sáng sớm.',
    defaultPlantName: 'Dương Xỉ Boston Treo',
    emoji: '🌿'
  },
  {
    id: 'bird-of-paradise',
    englishName: 'Bird of Paradise',
    scientificName: 'Strelitzia reginae / nicolai',
    vietnameseName: 'Cây Hoa Thiên điểu',
    aliases: ['bird of paradise', 'thien dieu', 'hoa thien dieu', 'strelitzia', 'cay thien dieu'],
    category: 'Hoa cảnh',
    waterCycleDays: 5,
    sunlight: 'Ánh sáng trực tiếp',
    soilType: 'Đất thịt nặng dinh dưỡng trộn phân hữu cơ ủ hoai',
    characteristics: 'Lá to bản dày như lá chuối vươn thẳng đứng, hoa rực rỡ như đầu chim hạc nhiệt đới. Cần đón nhiều ánh nắng rạng rỡ.',
    defaultPlantName: 'Thiên Điểu Đại Sảnh',
    emoji: '🦜'
  },
  {
    id: 'string-of-pearls',
    englishName: 'String of Pearls',
    scientificName: 'Curio rowleyanus / Senecio',
    vietnameseName: 'Sen đá Chuỗi ngọc',
    aliases: ['string of pearls', 'chuoi ngoc', 'sen da chuoi ngoc', 'curio', 'senecio rowleyanus'],
    category: 'Mọng nước & Sen đá',
    waterCycleDays: 10,
    sunlight: 'Nắng bán phần',
    soilType: 'Giá thể xỉ than + pumice + akadama siêu thoát nước',
    characteristics: 'Các hạt lá tròn vo như hạt ngọc bích xâu chuỗi rủ dài duyên dáng. Rất dễ úng nhũn nếu tưới đọng giọt trên thân hạt.',
    defaultPlantName: 'Chuỗi Ngọc Rủ Cửa Sổ',
    emoji: '📿'
  },
  {
    id: 'philodendron-pink-princess',
    englishName: 'Philodendron Pink Princess',
    scientificName: 'Philodendron erubescens cv. Pink Princess',
    vietnameseName: 'Trầu bà Hồng ngọc / Pink Princess',
    aliases: ['pink princess', 'philodendron', 'trau ba hong', 'hong ngoc', 'philodendron erubescens'],
    category: 'Kiểng lá',
    waterCycleDays: 4,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Xơ dừa chip + vỏ thông + perlite + đá bọt pumice',
    characteristics: 'Lá màu nâu đen thẫm xen lẫn vệt loang hồng phấn độc đáo. Cần ánh sáng gián tiếp sáng sủa để giữ độ biến dị variegation hồng.',
    defaultPlantName: 'Pink Princess Kiểng Lá',
    emoji: '💖'
  },
  {
    id: 'chinese-evergreen',
    englishName: 'Chinese Evergreen (Aglaonema)',
    scientificName: 'Aglaonema commutatum',
    vietnameseName: 'Cây Vạn lộc / Ngọc ngân',
    aliases: ['chinese evergreen', 'aglaonema', 'van loc', 'ngoc ngan', 'cay van loc', 'cay ngoc ngan'],
    category: 'Lọc khí & Dễ trồng',
    waterCycleDays: 5,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Đất mùn hữu cơ thoát nước tốt',
    characteristics: 'Lá pha đốm hồng đỏ hoặc vân trắng bạc rực rỡ, thích nghi xuất sắc trong môi trường máy lạnh văn phòng.',
    defaultPlantName: 'Vạn Lộc Để Bàn Làm Việc',
    emoji: '✨'
  },
  {
    id: 'anthurium',
    englishName: 'Anthurium (Flamingo Flower)',
    scientificName: 'Anthurium andraeanum',
    vietnameseName: 'Cây Hồng môn',
    aliases: ['anthurium', 'hong mon', 'cay hong mon', 'flamingo flower', 'hoa hong mon'],
    category: 'Hoa cảnh',
    waterCycleDays: 4,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Vỏ thông vụn trộn dớn mềm và xơ dừa',
    characteristics: 'Mo hoa hình trái tim bóng bẩy đỏ thắm hoặc hồng phấn, nhụy vàng vươn cao. Ra hoa bền suốt nhiều tuần liên tục.',
    defaultPlantName: 'Hồng Môn Cầu May Mắn',
    emoji: '🌸'
  },
  {
    id: 'jade-plant',
    englishName: 'Jade Plant (Money Plant)',
    scientificName: 'Crassula ovata',
    vietnameseName: 'Cây Ngọc bích (Sen đá phỉ thúy)',
    aliases: ['jade plant', 'ngoc bich', 'cay ngoc bich', 'phi thuy', 'crassula ovata', 'sen da ngoc bich'],
    category: 'Mọng nước & Sen đá',
    waterCycleDays: 12,
    sunlight: 'Nắng bán phần',
    soilType: 'Đất cát sỏi xỉ than thoát nước cực nhanh',
    characteristics: 'Lá dày bóng hình đồng xu mập mạp, cành cứng cáp như bonsai mini. Thân lá trữ nước giỏi, tượng trưng cho tài lộc bền vững.',
    defaultPlantName: 'Ngọc Bích Bonsai',
    emoji: '💎'
  },
  {
    id: 'succulent-echeveria',
    englishName: 'Succulent (Echeveria)',
    scientificName: 'Echeveria spp.',
    vietnameseName: 'Cây Sen đá (Hoa đá)',
    aliases: ['succulent', 'sen da', 'cay sen da', 'hoa da', 'echeveria', 'sen phat ba', 'sen da nau'],
    category: 'Mọng nước & Sen đá',
    waterCycleDays: 10,
    sunlight: 'Nắng bán phần',
    soilType: 'Giá thể xỉ than đập nhỏ + perlite + trấu hun thoát nước tối đa',
    characteristics: 'Lá xếp thành hình đóa hoa sen mọng nước duyên dáng. Rất sợ úng nước đọng kẽ lá, cần nhiều nắng để lên màu tươi.',
    defaultPlantName: 'Sen Đá Xinh',
    emoji: '🪷'
  },
  {
    id: 'cactus',
    englishName: 'Cactus (Desert Cactus)',
    scientificName: 'Cactaceae',
    vietnameseName: 'Cây Xương rồng cảnh',
    aliases: ['cactus', 'xuong rong', 'cay xuong rong', 'cactaceae', 'xuong rong tai tho'],
    category: 'Mọng nước & Sen đá',
    waterCycleDays: 15,
    sunlight: 'Ánh sáng trực tiếp',
    soilType: 'Đất cát pha sỏi vụn xỉ than siêu thoát nước',
    characteristics: 'Thân chứa nhiều nước, lá biến thành gai nhọn để giảm thoát hơi nước. Cần đón nhiều nắng và rất ít khi cần tưới.',
    defaultPlantName: 'Xương Rồng Mini',
    emoji: '🌵'
  },
  {
    id: 'fittonia',
    englishName: 'Fittonia (Nerve Plant)',
    scientificName: 'Fittonia albivenis',
    vietnameseName: 'Cây Cẩm nhung (Lá may mắn)',
    aliases: ['fittonia', 'cam nhung', 'cay cam nhung', 'nerve plant', 'la may man'],
    category: 'Kiểng lá',
    waterCycleDays: 3,
    sunlight: 'Ánh sáng gián tiếp',
    soilType: 'Đất mùn trộn perlite giữ ẩm',
    characteristics: 'Mạng lưới gân lá màu hồng, đỏ hoặc trắng nổi bật trên nền lá xanh. Rất nhạy cảm với khô hạn, rũ mềm ngay khi khát nước.',
    defaultPlantName: 'Cẩm Nhung May Mắn',
    emoji: '🌿'
  }
];

export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Smart matching function that finds a PlantTemplate from either:
 * - A Vietnamese plant name (e.g. "Bé Trầu Bà Lá Xẻ", "Lưỡi hổ", "Cây bàng Singapore")
 * - An English name or species (e.g. "Monstera", "Snake Plant", "Fiddle Leaf", "Pothos")
 * - A scientific name (e.g. "Sansevieria", "Ficus lyrata")
 * - Or any synonym/alias
 */
export function findPlantTemplate(query: string): PlantTemplate | null {
  if (!query || query.trim().length < 2) return null;

  const rawLower = query.toLowerCase().trim();
  const normalizedQuery = removeVietnameseTones(query);

  // 1. Direct ID / exact matches
  for (const tmpl of PLANT_TEMPLATES) {
    if (tmpl.id.toLowerCase() === rawLower) return tmpl;
    if (tmpl.englishName.toLowerCase() === rawLower) return tmpl;
    if (tmpl.vietnameseName.toLowerCase() === rawLower) return tmpl;
  }

  // 2. Exact match in aliases
  for (const tmpl of PLANT_TEMPLATES) {
    for (const alias of tmpl.aliases) {
      if (alias.toLowerCase() === rawLower || removeVietnameseTones(alias) === normalizedQuery) {
        return tmpl;
      }
    }
  }

  // 3. Substring match in English Name or Scientific Name
  for (const tmpl of PLANT_TEMPLATES) {
    const normEng = removeVietnameseTones(tmpl.englishName);
    const normSci = removeVietnameseTones(tmpl.scientificName);
    if (normEng.includes(normalizedQuery) || normalizedQuery.includes(normEng)) {
      return tmpl;
    }
    if (normSci.includes(normalizedQuery) || normalizedQuery.includes(normSci)) {
      return tmpl;
    }
  }

  // 4. Substring match in Vietnamese Name or Aliases
  for (const tmpl of PLANT_TEMPLATES) {
    const normVn = removeVietnameseTones(tmpl.vietnameseName);
    if (normVn.includes(normalizedQuery) || normalizedQuery.includes(normVn)) {
      return tmpl;
    }
    for (const alias of tmpl.aliases) {
      const normAlias = removeVietnameseTones(alias);
      if (normalizedQuery.includes(normAlias) || normAlias.includes(normalizedQuery)) {
        return tmpl;
      }
    }
  }

  // 5. Token keyword matching
  const queryTokens = normalizedQuery
    .split(/[\s,()\-./]+/)
    .filter((t) => t.length >= 3 && !['cay', 'chau', 'be', 'nha', 'cua', 'trong', 'cho'].includes(t));

  for (const tmpl of PLANT_TEMPLATES) {
    const searchString = [
      tmpl.englishName,
      tmpl.scientificName,
      tmpl.vietnameseName,
      tmpl.defaultPlantName,
      ...tmpl.aliases
    ]
      .map(removeVietnameseTones)
      .join(' ');

    for (const token of queryTokens) {
      if (searchString.includes(token)) {
        return tmpl;
      }
    }
  }

  return null;
}
