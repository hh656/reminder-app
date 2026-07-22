import { motion, AnimatePresence } from 'framer-motion';
import type { Reminder, Category } from '../utils/types';
import { ReminderCard } from './ReminderCard';

interface ReminderListProps {
  reminders: Reminder[];
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export function ReminderList({
  reminders,
  categories,
  onToggleComplete,
  onEdit,
  onDelete,
}: ReminderListProps) {
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return new Date(a.nextTriggerTime).getTime() - new Date(b.nextTriggerTime).getTime();
  });

  if (sortedReminders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/40 flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </motion.div>
        <p className="text-gray-500 mb-2">暂无提醒</p>
        <p className="text-gray-400 text-sm">点击右下角按钮添加新提醒</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="px-6 pb-24"
    >
      <AnimatePresence mode="popLayout">
        {sortedReminders.map((reminder) => {
          const category = categories.find(c => c.id === reminder.categoryId) || categories[0];
          return (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              category={category}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
