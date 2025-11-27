import { SelectOption } from './types';

// LINK GOOGLE SHEET CỦA BẠN: 
// https://docs.google.com/spreadsheets/d/1wR0WUVLF7ayzswKc6YocDZ0niYOTRL9v7KidlcaKvYE/edit?usp=sharing

// QUAN TRỌNG: Bạn cần làm theo hướng dẫn trong phần chat để lấy URL "Web App" và dán vào đây.
// URL sẽ có dạng: "https://script.google.com/macros/s/AKfycbx.../exec"
export const GOOGLE_SHEETS_API_URL = ""; 

export const TUM_COEFF = 0.5;

export const SERVICE_OPTIONS: SelectOption[] = [
  { 
    label: 'Trọn gói phần thô + Nhân công hoàn thiện (3.2tr/m²)', 
    value: 3200000,
    tooltip: 'Bao gồm vật tư thô (cát, đá, xi măng, sắt thép...) và nhân công làm đến hoàn thiện.'
  },
  { 
    label: 'Trọn gói chìa khóa trao tay (Dự kiến 5.5tr/m²)', 
    value: 5500000,
    tooltip: 'Bao gồm tất cả từ A-Z, chỉ việc dọn vào ở.'
  },
];

export const FOUNDATION_OPTIONS: SelectOption[] = [
  { label: 'Móng băng (Hệ số 60%)', value: 0.6, tooltip: 'Thông dụng cho nền đất tốt.' },
  { label: 'Móng đơn (Hệ số 30%)', value: 0.3, tooltip: 'Tiết kiệm, cho đất rất tốt và nhà nhỏ.' },
  { label: 'Móng cọc (Hệ số 40%)', value: 0.4, tooltip: 'Cho nền đất yếu, chưa bao gồm chi phí ép cọc.' },
  { label: 'Móng bè (Hệ số 100%)', value: 1.0, tooltip: 'Cho nền đất rất yếu.' },
];

export const ROOF_OPTIONS: SelectOption[] = [
  { label: 'Mái BTCT, lát gạch (Hệ số 50%)', value: 0.5, tooltip: 'Bền vững nhất, chống thấm tốt.' },
  { label: 'Mái tôn (Hệ số 30%)', value: 0.3, tooltip: 'Tiết kiệm chi phí nhất.' },
  { label: 'Mái ngói kèo sắt (Hệ số 70%)', value: 0.7, tooltip: 'Thẩm mỹ cao, mát mẻ.' },
  { label: 'Mái BTCT dán ngói (Hệ số 100%)', value: 1.0, tooltip: 'Kiên cố và thẩm mỹ nhất.' },
];

export const BASEMENT_OPTIONS: SelectOption[] = [
  { label: 'Không có hầm', value: 0 },
  { label: 'Chìm nửa hầm (Hệ số 150%)', value: 1.5 },
  { label: 'Chìm toàn bộ hầm (Hệ số 200%)', value: 2.0 },
];