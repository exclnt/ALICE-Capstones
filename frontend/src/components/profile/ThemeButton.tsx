import { Icon } from '@iconify/react';

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
      className={`relative flex-1 p-1 rounded-xl font-bold  overflow-hidden ${
        isSelected
          ? 'bg-bg-main dark:text-white text-black'
          : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer'
      }`}
    >
      <div
        className={`grid  min-h-6 ${isSelected ? 'place-items-end dark:place-items-start' : 'place-items-start dark:place-items-end'}`}
      >
        <Icon
          icon={icon}
          className={`col-start-1 row-start-1 text-2xl transition-all duration-1000 ease-in-out ${
            isSelected
              ? 'opacity-100 translate-x-0  rotate-360'
              : 'opacity-0 translate-x-50 dark:-translate-x-50 rotate-0 pointer-events-none'
          }`}
        />

        <span
          className={`col-start-1 row-start-1 transition-all duration-1000 ease-in-out ${
            isSelected
              ? 'opacity-0 translate-x-15 dark:-translate-x-15 pointer-events-none'
              : 'opacity-100 translate-x-0'
          }`}
        >
          {label}
        </span>
      </div>
    </button>
  );
}
