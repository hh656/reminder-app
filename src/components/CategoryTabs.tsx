import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '../utils/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (id: string) => void;
  onManageCategories: () => void;
}

export function CategoryTabs({ categories, selectedCategoryId, onSelect, onManageCategories }: CategoryTabsProps) {
  const tabs = [
    { id: 'all', name: '全部', color: '#94a3b8' },
    ...categories.map(c => ({ id: c.id, name: c.name, color: c.color })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="px-6 mb-4"
    >
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategoryId === tab.id
                  ? 'text-white shadow-lg shadow-black/10'
                  : 'bg-white/40 text-gray-600 hover:bg-white/60'
              }`}
              style={{
                backgroundColor: selectedCategoryId === tab.id ? tab.color : undefined,
              }}
              aria-label={`选择${tab.name}分类`}
            >
              {tab.name}
            </motion.button>
          ))}
        </AnimatePresence>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onManageCategories}
          className="glass-button p-2 flex-shrink-0"
          aria-label="管理分类"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
