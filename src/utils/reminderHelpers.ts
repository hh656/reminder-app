import type { Reminder, RepeatMode } from '../utils/types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDateTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString() === date.toDateString();
  
  let datePart: string;
  if (isToday) {
    datePart = '今天';
  } else if (isTomorrow) {
    datePart = '明天';
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    datePart = `${month}月${day}日 ${weekDay}`;
  }
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timePart = `${hours}:${minutes}`;
  
  return `${datePart} ${timePart}`;
}

export function formatTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDate(dateTimeStr: string): string {
  const date = new Date(dateTimeStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateNextTriggerTime(
  dateTime: string,
  repeatMode: RepeatMode,
  repeatWeekDays?: number[],
  advanceMinutes: number = 0
): string {
  const now = new Date();
  const targetDate = parseLocalDateTime(dateTime);
  
  let nextDate = new Date(targetDate);
  nextDate.setMinutes(nextDate.getMinutes() - advanceMinutes);
  
  if (nextDate <= now) {
    switch (repeatMode) {
      case 'daily':
        while (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
        
      case 'weekly':
        if (repeatWeekDays && repeatWeekDays.length > 0) {
          const currentDay = now.getDay();
          let minDiff = Infinity;
          let selectedDay: number | null = null;
          
          for (const day of repeatWeekDays) {
            let diff = day - currentDay;
            if (diff <= 0) diff += 7;
            if (diff < minDiff) {
              minDiff = diff;
              selectedDay = day;
            }
          }
          
          if (selectedDay !== null) {
            nextDate = new Date(now);
            nextDate.setDate(nextDate.getDate() + minDiff);
            nextDate.setHours(targetDate.getHours(), targetDate.getMinutes() - advanceMinutes, 0, 0);
          }
        } else {
          while (nextDate <= now) {
            nextDate.setDate(nextDate.getDate() + 7);
          }
        }
        break;
        
      case 'monthly':
        while (nextDate <= now) {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        break;
        
      case 'none':
      default:
        return nextDate.toISOString();
    }
  }
  
  return nextDate.toISOString();
}

export function isReminderDue(reminder: Reminder): boolean {
  if (reminder.isCompleted) return false;
  
  const now = new Date();
  const triggerTime = new Date(reminder.nextTriggerTime);
  
  return now >= triggerTime && !reminder.isNotified;
}

export function getRepeatLabel(repeatMode: RepeatMode, repeatWeekDays?: number[]): string {
  const weekDayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  
  switch (repeatMode) {
    case 'none':
      return '不重复';
    case 'daily':
      return '每天';
    case 'weekly':
      if (repeatWeekDays && repeatWeekDays.length > 0) {
        return repeatWeekDays.map(d => weekDayLabels[d]).join(' ');
      }
      return '每周';
    case 'monthly':
      return '每月';
    default:
      return '';
  }
}

export function toLocalISOString(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().slice(0, 16);
}

export function parseLocalDateTime(dateTimeStr: string): Date {
  const [datePart, timePart] = dateTimeStr.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}
