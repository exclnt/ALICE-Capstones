import { useState } from 'react';
import { Icon } from '@iconify/react';
import InputShell from '../InputShell';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isRequired?: boolean;
  // 1. Add the autoComplete prop here
  autoComplete?: string;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  isRequired,
  autoComplete = 'current-password',
}: PasswordInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <InputShell label={label} isFocused={isFocused} hasValue={value.length > 0}>
      <input
        required={isRequired}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete={autoComplete}
        className="w-full bg-transparent px-4 pt-2 pb-2 text-text-main rounded-xl outline-none"
      />
      <Icon
        icon={visible ? 'mdi:eye-outline' : 'mdi:eye-closed'}
        onClick={() => setVisible(!visible)}
        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-text-muted hover:text-text-main transition-colors"
      />
    </InputShell>
  );
}
