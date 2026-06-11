// Similan Islands Liveaboard Data

export interface LiveaboardTrip {
  id: string;
  duration: string;
  divesCount: number;
  description: {
    zh: string;
    en: string;
    th: string;
  };
  highlights: {
    zh: string[];
    en: string[];
    th: string[];
  };
  price: {
    standard: number;
    premium: number;
    deluxe: number;
  };
}

export const liveaboardTrips: LiveaboardTrip[] = [
  {
    id: '2d1n',
    duration: '2D1N',
    divesCount: 4,
    description: {
      zh: '适合周末的短途船宿体验，探索斯米兰群岛的核心潜点。',
      en: 'Perfect weekend liveaboard experience exploring the best of Similan Islands.',
      th: 'ประสบการณ์ไหล่าบอร์ดสุดสัปดาห์สำรวจจุดดำน้ำที่ดีที่สุดของหมู่เกาะสิมิลัน',
    },
    highlights: {
      zh: ['2次夜潜', '全餐含饮料', '免费装备租赁'],
      en: ['2 night dives', 'Full board', 'Free gear rental'],
      th: ['ดำน้ำกลางคืน 2 ครั้ง', 'อาหารครบ3มื้อ', 'ยืมอุปกรณ์ฟรี'],
    },
    price: {
      standard: 8500,
      premium: 10500,
      deluxe: 13500,
    },
  },
  {
    id: '3d2n',
    duration: '3D2N',
    divesCount: 8,
    description: {
      zh: '最受欢迎的行程安排，充分探索斯米兰群岛和红石、紫石。',
      en: 'Most popular itinerary, fully explore Similan Islands and Richelieu Rock.',
      th: 'เส้นทางยอดนิยมสำรวจหมู่เกาะสิมิลันและริชเชอลิวร็อกครบถ้วน',
    },
    highlights: {
      zh: ['8次潜水', '含3餐+下午茶', '免费高氧气瓶'],
      en: ['8 dives', 'All meals + afternoon snacks', 'Free nitrox'],
      th: ['ดำน้ำ 8 ครั้ง', 'อาหาร3มื้อ+ของว่างบ่าย', 'ไนทรอกซ์ฟรี'],
    },
    price: {
      standard: 14500,
      premium: 18000,
      deluxe: 23000,
    },
  },
  {
    id: '4d3n',
    duration: '4D3N',
    divesCount: 12,
    description: {
      zh: '深度探索，包括BON islands和其他远端潜点，适合有经验的潜水员。',
      en: 'Deep exploration including BON islands and remote sites, for experienced divers.',
      th: 'สำรวจลึกรวม BON islands และจุดดำน้ำห่างไกลสำหรับนักดำน้ำมีประสบการณ์',
    },
    highlights: {
      zh: ['12次潜水', '所有餐食+宵夜', '免费高氧+重潜配重'],
      en: ['12 dives', 'All meals + midnight snacks', 'Free nitrox + weights'],
      th: ['ดำน้ำ 12 ครั้ง', 'ทุกมื้อ+ของว่างดึก', 'ไนทรอกซ์+น้ำหนักฟรี'],
    },
    price: {
      standard: 21000,
      premium: 26500,
      deluxe: 34000,
    },
  },
];

export const cabinTypes = [
  {
    id: 'standard',
    label: { zh: '标准舱', en: 'Standard Cabin', th: 'ห้องมาตรฐาน' },
    description: {
      zh: '共享舱室，双层床，独立卫生间',
      en: 'Shared cabin, bunk beds, shared bathroom',
      th: 'ห้องร่วม เตียงสองชั้น ห้องน้ำรวม',
    },
  },
  {
    id: 'premium',
    label: { zh: '海景舱', en: 'Premium Cabin', th: 'ห้องพรีเมียม' },
    description: {
      zh: '海景窗，私人卫生间，空调',
      en: 'Sea view window, private bathroom, AC',
      th: 'หน้าต่างวิวทะเล ห้องน้ำส่วนตัว เครื่องปรับอากาศ',
    },
  },
  {
    id: 'deluxe',
    label: { zh: '豪华舱', en: 'Deluxe Suite', th: 'ห้องลอกซ์ชูท' },
    description: {
      zh: '大床，阳台，套房设施，迷你吧',
      en: 'King bed, balcony, suite facilities, minibar',
      th: 'เตียงคิง ระเบียง สิ่งอำนวยความสะดวกระดับลอกซ์ มินิบาร์',
    },
  },
];