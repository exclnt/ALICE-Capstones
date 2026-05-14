import { useState } from 'react';
import InputShell from './InputShell';

interface TextInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TextInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputShell label={label} isFocused={isFocused} hasValue={value.length > 0}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-transparent px-4 pt-2 pb-2 text-text-main rounded-xl outline-none ${className}`}
      />
    </InputShell>
  );
}
