interface ThemeButtonPropType {
  toggleActive: () => void;
  label: string;
  isActive: string;
}

export function ThemeButton({ toggleActive, label, isActive }: ThemeButtonPropType) {
  return (
    <button
      onClick={toggleActive}
      disabled={isActive === label.toLowerCase()}
      className={`flex-1 font-bold p-4 ${isActive === label.toLowerCase() ? 'bg-primary text-bg-main' : 'bg-secondary text-text-muted'}`}
    >
      {label}
    </button>
  );
}
