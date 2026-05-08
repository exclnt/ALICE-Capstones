import { useState } from 'react';
import { Icon } from '@iconify/react';

interface FormInputProps {
  type: string;
  label: string;
  isPassword?: boolean;
}

export default function FormInput({ type, label, isPassword }: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    return setPasswordVisible(!passwordVisible);
  };

  const shouldMoveLabel = isFocused || value.length > 0;

  return (
    <div className={`relative bg-primary/50 rounded-xl mt-8 shrink-0 w-full`}>
      <label
        className={`absolute left-2  transition-all duration-200 pointer-events-none
            ${
              shouldMoveLabel
                ? '-top-5 text-sm text-text-main'
                : 'top-1/2 -translate-y-1/2 text-sm text-text-muted'
            }`}
      >
        {label}
      </label>

      {isPassword ? (
        <div className="flex items-center">
          <input
            type={passwordVisible ? 'text' : type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-7 pt-2 pb-2 pr-10 text-text-main rounded-xl"
          />
          <Icon
            icon={passwordVisible ? 'mdi:eye-outline' : 'mdi:eye-closed'}
            onClick={togglePassword}
            className={`text-xl absolute right-4 top-5 -translate-y-1/2 cursor-pointer text-text-muted hover:text-text-main transition-colors ${shouldMoveLabel ? 'block' : 'hidden'}`}
          />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent px-7 pt-2 pb-2 text-text-main rounded-xl"
        />
      )}
    </div>
  );
}
