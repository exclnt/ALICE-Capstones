import ConfigContainer from './ConfigContainer';
import { ThemeButton } from './ThemeButton';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeConfig() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ConfigContainer label="KONFIGURASI APP" icon="ph:gear-six-light">
      <div className="flex mt-5 p-3">
        <div className="flex w-full rounded-xl  overflow-hidden">
          <ThemeButton label="Dark" isActive={theme} toggleActive={toggleTheme} />
          <ThemeButton label="Light" isActive={theme} toggleActive={toggleTheme} />
        </div>
      </div>
    </ConfigContainer>
  );
}
