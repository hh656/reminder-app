import { motion } from 'framer-motion';

interface HeaderProps {
  permission: 'granted' | 'denied' | 'default';
  onRequestPermission: () => Promise<'granted' | 'denied' | 'default'>;
  error?: string | null;
}

export function Header({ permission, onRequestPermission, error }: HeaderProps) {
  const now = new Date();
  const hour = now.getHours();
  
  let greeting: string;
  if (hour < 6) greeting = '夜深了';
  else if (hour < 12) greeting = '早上好';
  else if (hour < 14) greeting = '中午好';
  else if (hour < 18) greeting = '下午好';
  else greeting = '晚上好';
  
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            className="text-3xl font-semibold text-gray-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {greeting}
          </motion.h1>
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {dateStr}
          </motion.p>
          
          {error && (
            <motion.p
              className="text-orange-500 text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ⚠️ {error}
            </motion.p>
          )}
        </div>
        
        {permission !== 'granted' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRequestPermission}
            className="glass-button px-4 py-2 text-sm text-gray-700 flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {permission === 'denied' ? '启用通知' : '允许通知'}
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}
