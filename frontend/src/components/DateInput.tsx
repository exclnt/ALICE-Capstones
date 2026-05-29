import { useState } from 'react';
import InputShell from './InputShell';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  isRequired?: boolean;
}

export default function DateInput({
  label,
  value,
  onChange,
  className,
  isRequired,
}: DateInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputShell label={label} isFocused={isFocused} hasValue={value.length > 0}>
      <input
        required={isRequired}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-transparent px-4 py-2 text-text-main rounded-xl outline-none ${className}`}
      />
    </InputShell>
  );
}
