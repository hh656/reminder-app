import { motion } from 'framer-motion';

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, type: 'spring' }}
      whileHover={{ scale: 1.1, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center z-50"
      aria-label="添加提醒"
    >
      <motion.svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </motion.svg>
    </motion.button>
  );
}
