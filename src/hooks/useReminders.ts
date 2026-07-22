import { useState, useEffect, useCallback } from 'react';
import type { Reminder, Category, ReminderFormData } from '../utils/types';
import { PRESET_CATEGORIES } from '../utils/types';
import { generateId, calculateNextTriggerTime } from '../utils/reminderHelpers';

const REMINDERS_STORAGE_KEY = 'reminder_app_reminders';
const CATEGORIES_STORAGE_KEY = 'reminder_app_categories';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(REMINDERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(PRESET_CATEGORIES.map(c => c.id));
        const newCategories = parsed.filter((c: Category) => !existingIds.has(c.id));
        return [...PRESET_CATEGORIES, ...newCategories];
      } catch {
        return PRESET_CATEGORIES;
      }
    }
    return PRESET_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const customCategories = categories.filter(c => !PRESET_CATEGORIES.some(pc => pc.id === c.id));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(customCategories));
  }, [categories]);

  const addReminder = useCallback((data: ReminderFormData) => {
    const now = new Date().toISOString();
    const nextTriggerTime = calculateNextTriggerTime(
      data.dateTime,
      data.repeatMode,
      data.repeatWeekDays,
      data.advanceMinutes
    );

    const newReminder: Reminder = {
      id: generateId(),
      ...data,
      nextTriggerTime,
      isCompleted: false,
      isNotified: false,
      createdAt: now,
      updatedAt: now,
    };

    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  }, []);

  const updateReminder = useCallback((id: string, data: ReminderFormData) => {
    const now = new Date().toISOString();
    const nextTriggerTime = calculateNextTriggerTime(
      data.dateTime,
      data.repeatMode,
      data.repeatWeekDays,
      data.advanceMinutes
    );

    setReminders(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, ...data, nextTriggerTime, isNotified: false, updatedAt: now }
          : r
      )
    );
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setReminders(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, isCompleted: !r.isCompleted, updatedAt: new Date().toISOString() }
          : r
      )
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const markAsNotified = useCallback((id: string) => {
    setReminders(prev =>
      prev.map(r => {
        if (r.id === id) {
          if (r.repeatMode !== 'none') {
            // 重复事件：计算下次触发时间，等待下一次提醒
            const nextTriggerTime = calculateNextTriggerTime(
              r.dateTime,
              r.repeatMode,
              r.repeatWeekDays,
              r.advanceMinutes
            );
            return { ...r, isNotified: false, nextTriggerTime, updatedAt: new Date().toISOString() };
          }
          // 不重复事件：通知触发后直接标记为已完成，避免一直挂在列表中
          return { ...r, isNotified: true, isCompleted: true, updatedAt: new Date().toISOString() };
        }
        return r;
      })
    );
  }, []);

  const markAllComplete = useCallback(() => {
    setReminders(prev =>
      prev.map(r => ({ ...r, isCompleted: true, updatedAt: new Date().toISOString() }))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setReminders(prev => prev.filter(r => !r.isCompleted));
  }, []);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = { ...category, id: generateId() };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    if (PRESET_CATEGORIES.some(c => c.id === id)) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    setReminders(prev =>
      prev.map(r => (r.categoryId === id ? { ...r, categoryId: 'life' } : r))
    );
  }, []);

  const exportData = useCallback(() => {
    const data = {
      reminders,
      categories: categories.filter(c => !PRESET_CATEGORIES.some(pc => pc.id === c.id)),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [reminders, categories]);

  const importData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.reminders) {
        setReminders(data.reminders);
      }
      if (data.categories) {
        setCategories(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newCategories = data.categories.filter((c: Category) => !existingIds.has(c.id));
          return [...prev, ...newCategories];
        });
      }
      return { success: true, message: '导入成功' };
    } catch (error) {
      return { success: false, message: '导入失败：无效的 JSON 格式' };
    }
  }, []);

  return {
    reminders,
    categories,
    addReminder,
    updateReminder,
    toggleComplete,
    deleteReminder,
    markAsNotified,
    markAllComplete,
    clearCompleted,
    addCategory,
    updateCategory,
    deleteCategory,
    exportData,
    importData,
  };
}
