import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reminder, Category } from '../utils/types';
import { formatDateTime, getRepeatLabel } from '../utils/reminderHelpers';

interface ReminderCardProps {
  reminder: Reminder;
  category: Category;
  onToggleComplete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export function ReminderCard({
  reminder,
  category,
  onToggleComplete,
  onEdit,
  onDelete,
}: ReminderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuDirection, setMenuDirection] = useState<'down' | 'up'>('down');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const repeatLabel = getRepeatLabel(reminder.repeatMode, reminder.repeatWeekDays);

  // 打开菜单时，根据按钮在视口中的位置决定向上还是向下展开，避免被遮挡
  const handleToggleMenu = () => {
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // 菜单高度约 96px，预留余量判断
      setMenuDirection(spaceBelow < 120 ? 'up' : 'down');
    }
    setShowMenu(!showMenu);
  };

  // 点击菜单外部时关闭
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-4 mb-3 relative ${
        reminder.isCompleted ? 'opacity-60' : ''
      }`}
    >
      {reminder.isNotified && !reminder.isCompleted && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 4 }}
          className="absolute left-0 top-0 bottom-0 bg-blue-500 rounded-l-2xl"
        />
      )}

      <div className="flex items-start gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleComplete(reminder.id)}
          className={`checkbox-animated flex-shrink-0 mt-1 ${
            reminder.isCompleted ? 'checked' : ''
          }`}
          aria-label={reminder.isCompleted ? '标记为未完成' : '标记为完成'}
        />

        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-medium text-gray-800 mb-1 truncate ${
              reminder.isCompleted ? 'line-through text-gray-400' : ''
            }`}
          >
            {reminder.title}
          </h3>

          {reminder.note && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
              {reminder.note}
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDateTime(reminder.dateTime)}
            </span>

            {reminder.repeatMode !== 'none' && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {repeatLabel}
              </span>
            )}

            <span
              className="text-xs text-white px-2 py-0.5 rounded-full"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          </div>
        </div>

        <div className="relative">
          <motion.button
            ref={buttonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleMenu}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
            aria-label="更多操作"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 w-32 glass-card py-1 z-50 shadow-2xl ${
                  menuDirection === 'down' ? 'top-full mt-1' : 'bottom-full mb-1'
                }`}
              >
                <button
                  onClick={() => {
                    onEdit(reminder);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-white/60 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  编辑
                </button>
                <button
                  onClick={() => {
                    onDelete(reminder.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50/60 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  删除
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
