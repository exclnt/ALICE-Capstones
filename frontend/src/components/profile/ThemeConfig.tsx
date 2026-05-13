import ConfigContainer from './ConfigContainer';
import { ThemeButton } from './ThemeButton';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeConfig() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ConfigContainer label="KONFIGURASI APP" icon="ph:gear-six-light">
      <div className="flex mt-5 p-3">
        <div className="flex w-full rounded-2xl p-2 border-2 overflow-hidden">
          <ThemeButton
            label="Dark"
            isActive={theme}
            toggleActive={toggleTheme}
            icon="material-symbols:dark-mode-rounded"
          />
          <ThemeButton
            label="Light"
            isActive={theme}
            toggleActive={toggleTheme}
            icon="material-symbols:wb-sunny-rounded"
          />
        </div>
      </div>
    </ConfigContainer>
  );
}
