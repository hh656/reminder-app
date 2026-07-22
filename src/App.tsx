import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryTabs } from './components/CategoryTabs';
import { ReminderList } from './components/ReminderList';
import { FloatingButton } from './components/FloatingButton';
import { AddEditModal } from './components/AddEditModal';
import { CategoryManager } from './components/CategoryManager';
import { useReminders } from './hooks/useReminders';
import { useNotification } from './hooks/useNotification';
import type { Reminder, ReminderFormData } from './utils/types';

function App() {
  const {
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
  } = useReminders();

  const { permission, requestPermission, notificationError } = useNotification(reminders, markAsNotified);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>();
  

  const filteredReminders = useMemo(() => {
    return reminders.filter(reminder => {
      const matchesSearch = !searchQuery ||
        reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reminder.note && reminder.note.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategoryId === 'all' || reminder.categoryId === selectedCategoryId;
      
      return matchesSearch && matchesCategory;
    });
  }, [reminders, searchQuery, selectedCategoryId]);

  const handleSubmit = (data: ReminderFormData) => {
    if (editingReminder) {
      updateReminder(editingReminder.id, data);
    } else {
      addReminder(data);
    }
    setEditingReminder(undefined);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reminders-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = importData(event.target?.result as string);
          if (!result.success) {
            alert(result.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const completedCount = reminders.filter(r => r.isCompleted).length;

  return (
    <div className="min-h-screen gradient-bg grid-pattern">
      <div className="max-w-lg mx-auto">
        <Header permission={permission} onRequestPermission={requestPermission} error={notificationError} />
        
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          onManageCategories={() => setIsCategoryManagerOpen(true)}
        />

        {completedCount > 0 && (
          <div className="px-6 mb-4 flex items-center justify-end gap-2">
            <button
              onClick={markAllComplete}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              全部标记完成
            </button>
            <button
              onClick={clearCompleted}
              className="text-sm text-red-500 hover:text-red-700"
            >
              清除已完成
            </button>
          </div>
        )}

        <ReminderList
          reminders={filteredReminders}
          categories={categories}
          onToggleComplete={toggleComplete}
          onEdit={handleEdit}
          onDelete={deleteReminder}
        />

        <div className="fixed left-6 bottom-6 flex items-center gap-2 z-40">
          <button
            onClick={handleExport}
            className="glass-button p-3 text-gray-600"
            aria-label="导出数据"
            title="导出数据"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            onClick={handleImport}
            className="glass-button p-3 text-gray-600"
            aria-label="导入数据"
            title="导入数据"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <FloatingButton onClick={() => {
          setEditingReminder(undefined);
          setIsModalOpen(true);
        }} />

        <AddEditModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingReminder(undefined);
          }}
          onSubmit={handleSubmit}
          editReminder={editingReminder}
          categories={categories}
        />

        <CategoryManager
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
          categories={categories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
        />
      </div>
    </div>
  );
}

export default App;
