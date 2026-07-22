import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '../utils/types';
import { PRESET_CATEGORIES } from '../utils/types';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

const COLORS = [
  '#60a5fa', '#34d399', '#f472b6', '#a78bfa', '#fb923c',
  '#f87171', '#38bdf8', '#4ade80', '#fbbf24', '#c084fc',
];

const ICONS = ['briefcase', 'heart', 'book-open', 'activity', 'home', 'work', 'star', 'tag'];

export function CategoryManager({ isOpen, onClose, categories, onAddCategory, onUpdateCategory, onDeleteCategory }: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: COLORS[0], icon: ICONS[0] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    if (!newCategory.name.trim()) return;
    onAddCategory(newCategory);
    setNewCategory({ name: '', color: COLORS[0], icon: ICONS[0] });
    setIsAdding(false);
  };

  const handleEdit = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    onUpdateCategory(editingId!, {
      name: editingCategory.name,
      color: editingCategory.color,
      icon: editingCategory.icon,
    });
    setEditingId(null);
    setEditingCategory(null);
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditingCategory(category);
  };

  const customCategories = categories.filter(c => !PRESET_CATEGORIES.some(pc => pc.id === c.id));

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
                <h2 className="text-lg font-semibold text-gray-800">管理分类</h2>
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

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">预设分类</h3>
                  <div className="space-y-2">
                    {PRESET_CATEGORIES.map(category => (
                      <div
                        key={category.id}
                        className="flex items-center gap-3 p-3 bg-white/30 rounded-xl"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <span className="text-gray-700 flex-1">{category.name}</span>
                        <span className="text-xs text-gray-400">不可删除</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500">自定义分类</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsAdding(true)}
                      className="text-blue-500 text-sm font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      添加
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {isAdding && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 overflow-hidden"
                      >
                        <div className="p-4 bg-white/30 rounded-xl space-y-3">
                          <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="分类名称"
                            className="glass-input w-full text-sm"
                            autoFocus
                          />
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">颜色</label>
                            <div className="flex flex-wrap gap-2">
                              {COLORS.map(color => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                                  className={`w-6 h-6 rounded-full transition-transform ${
                                    newCategory.color === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-300' : ''
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAdding(false)}
                              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                            >
                              取消
                            </button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={handleAdd}
                              disabled={!newCategory.name.trim()}
                              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg disabled:opacity-50"
                            >
                              添加
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    {customCategories.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-4">暂无自定义分类</p>
                    ) : (
                      customCategories.map(category => (
                        <AnimatePresence key={category.id}>
                          {editingId === category.id ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="p-4 bg-white/30 rounded-xl space-y-3"
                            >
                              <input
                                type="text"
                                value={editingCategory?.name || ''}
                                onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                                className="glass-input w-full text-sm"
                                autoFocus
                              />
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">颜色</label>
                                <div className="flex flex-wrap gap-2">
                                  {COLORS.map(color => (
                                    <button
                                      key={color}
                                      type="button"
                                      onClick={() => setEditingCategory(prev => prev ? { ...prev, color } : null)}
                                      className={`w-6 h-6 rounded-full transition-transform ${
                                        editingCategory?.color === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-300' : ''
                                      }`}
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditingCategory(null);
                                  }}
                                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                                >
                                  取消
                                </button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={handleEdit}
                                  disabled={!editingCategory?.name.trim()}
                                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg disabled:opacity-50"
                                >
                                  保存
                                </motion.button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-3 p-3 bg-white/30 rounded-xl"
                            >
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: category.color }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                              <span className="text-gray-700 flex-1">{category.name}</span>
                              <div className="flex items-center gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => startEditing(category)}
                                  className="p-2 text-gray-400 hover:text-blue-500"
                                  aria-label="编辑"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => onDeleteCategory(category.id)}
                                  className="p-2 text-gray-400 hover:text-red-500"
                                  aria-label="删除"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/20">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full glass-button py-3 text-gray-700 font-medium"
                >
                  完成
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
