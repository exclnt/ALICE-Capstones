import { Icon } from '@iconify/react';
// Use the import you already have in your project
import { motion } from 'motion/react';

interface ThemeButtonPropType {
  toggleActive: () => void;
  label: string;
  isActive: string;
  icon: string;
}

export function ThemeButton({ toggleActive, label, icon, isActive }: ThemeButtonPropType) {
  const isSelected = isActive === label.toLowerCase();

  return (
    <button
      onClick={toggleActive}
      disabled={isSelected}
      aria-label={label}
      className={`relative flex-1 p-1 rounded-xl font-bold overflow-hidden transition-colors duration-300 ${
        isSelected
          ? 'bg-bg-main text-primary'
          : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer'
      }`}
    >
      <div
        className={`grid min-h-6 transition-all duration-300 ${
          isSelected
            ? 'place-items-end dark:place-items-start'
            : 'place-items-start dark:place-items-end'
        }`}
      >
        <motion.div
          className="col-start-1 row-start-1 text-2xl"
          initial={false}
          animate={{
            opacity: isSelected ? 1 : 0,
            x: isSelected ? 0 : isActive.toLowerCase() === 'dark' ? -200 : 200,
            rotate: isSelected ? 360 : 0,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          style={{ pointerEvents: isSelected ? 'auto' : 'none' }}
        >
          <Icon icon={icon} />
        </motion.div>

        <motion.span
          className="col-start-1 row-start-1"
          initial={false}
          animate={{
            opacity: isSelected ? 0 : 1,
            x: isSelected ? (isActive.toLowerCase() === 'dark' ? -15 : 15) : 0,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ pointerEvents: isSelected ? 'none' : 'auto' }}
        >
          {label}
        </motion.span>
      </div>
    </button>
  );
}
