export type RepeatMode = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Reminder {
  id: string;
  title: string;
  note?: string;
  dateTime: string;
  repeatMode: RepeatMode;
  repeatWeekDays?: number[];
  categoryId: string;
  advanceMinutes: number;
  nextTriggerTime: string;
  isCompleted: boolean;
  isNotified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderFormData {
  title: string;
  note?: string;
  dateTime: string;
  repeatMode: RepeatMode;
  repeatWeekDays?: number[];
  categoryId: string;
  advanceMinutes: number;
}

export const PRESET_CATEGORIES: Category[] = [
  { id: 'work', name: '工作', color: '#60a5fa', icon: 'briefcase' },
  { id: 'life', name: '生活', color: '#34d399', icon: 'heart' },
  { id: 'study', name: '学习', color: '#f472b6', icon: 'book-open' },
  { id: 'health', name: '健康', color: '#a78bfa', icon: 'activity' },
];

export const ADVANCE_OPTIONS = [
  { value: 0, label: '准点' },
  { value: 5, label: '5分钟前' },
  { value: 15, label: '15分钟前' },
  { value: 30, label: '30分钟前' },
  { value: 60, label: '1小时前' },
];

export const WEEK_DAYS = [
  { value: 0, label: '周日' },
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
];
