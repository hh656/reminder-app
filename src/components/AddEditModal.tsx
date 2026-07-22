import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reminder, Category, ReminderFormData, RepeatMode } from '../utils/types';
import { ADVANCE_OPTIONS, WEEK_DAYS } from '../utils/types';
import { toLocalISOString } from '../utils/reminderHelpers';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReminderFormData) => void;
  editReminder?: Reminder;
  categories: Category[];
}

export function AddEditModal({ isOpen, onClose, onSubmit, editReminder, categories }: AddEditModalProps) {
  const [formData, setFormData] = useState<ReminderFormData>({
    title: '',
    note: '',
    dateTime: '',
    repeatMode: 'none',
    repeatWeekDays: [],
    categoryId: 'life',
    advanceMinutes: 0,
  });

  useEffect(() => {
    if (editReminder) {
      setFormData({
        title: editReminder.title,
        note: editReminder.note || '',
        dateTime: toLocalISOString(new Date(editReminder.dateTime)),
        repeatMode: editReminder.repeatMode,
        repeatWeekDays: editReminder.repeatWeekDays || [],
        categoryId: editReminder.categoryId,
        advanceMinutes: editReminder.advanceMinutes,
      });
    } else {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      setFormData({
        title: '',
        note: '',
        dateTime: toLocalISOString(now),
        repeatMode: 'none',
        repeatWeekDays: [],
        categoryId: 'life',
        advanceMinutes: 0,
      });
    }
  }, [editReminder, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
    onClose();
  };

  const handleWeekDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      repeatWeekDays: prev.repeatWeekDays?.includes(day)
        ? prev.repeatWeekDays.filter(d => d !== day)
        : [...(prev.repeatWeekDays || []), day].sort(),
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-4 right-4 bottom-4 top-4 sm:left-1/2 sm:top-1/2 sm:right-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md z-50 overflow-hidden"
          >
            <div className="glass-modal h-full flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
                <h2 className="text-lg font-semibold text-gray-800">
                  {editReminder ? '编辑提醒' : '新建提醒'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="关闭"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标题 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="glass-input w-full text-gray-800"
                    placeholder="输入提醒标题"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    className="glass-input w-full text-gray-800 resize-none"
                    placeholder="添加备注信息..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">提醒时间</label>
                  <input
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                    className="glass-input w-full text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">提前提醒</label>
                  <select
                    value={formData.advanceMinutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, advanceMinutes: Number(e.target.value) }))}
                    className="glass-input w-full text-gray-800"
                  >
                    {ADVANCE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">重复模式</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['none', 'daily', 'weekly', 'monthly'] as RepeatMode[]).map(mode => (
                      <motion.button
                        key={mode}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, repeatMode: mode }))}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.repeatMode === mode
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-white/40 text-gray-600 hover:bg-white/60'
                        }`}
                      >
                        {mode === 'none' && '不重复'}
                        {mode === 'daily' && '每天'}
                        {mode === 'weekly' && '每周'}
                        {mode === 'monthly' && '每月'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {formData.repeatMode === 'weekly' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">选择星期</label>
                      <div className="flex flex-wrap gap-2">
                        {WEEK_DAYS.map(day => (
                          <motion.button
                            key={day.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => handleWeekDayToggle(day.value)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              formData.repeatWeekDays?.includes(day.value)
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/40 text-gray-600 hover:bg-white/60'
                            }`}
                          >
                            {day.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, categoryId: category.id }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          formData.categoryId === category.id
                            ? 'text-white shadow-lg'
                            : 'bg-white/40 text-gray-600 hover:bg-white/60'
                        }`}
                        style={{
                          backgroundColor: formData.categoryId === category.id ? category.color : undefined,
                        }}
                      >
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </form>

              <div className="px-6 py-4 border-t border-white/20 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 glass-button py-3 text-gray-700 font-medium"
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!formData.title.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editReminder ? '保存' : '创建'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
