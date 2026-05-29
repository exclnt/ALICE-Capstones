import InputShell from './InputShell';
import { useState } from 'react';

interface SelectionInputProp {
  label: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  options: Array<{ id: string; name: string }>;
}

export default function SelectionInput({
  label,
  value,
  onChange,
  className,
  options,
}: SelectionInputProp) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputShell label={label} isFocused={isFocused} hasValue={value.length > 0}>
      <select
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-transparent px-4 pt-2 pb-2 text-text-main rounded-xl outline-none ${className}`}
      >
        {options.map((option) => {
          return (
            <option key={option.id} value={option.id} className="bg-bg-main text-text-main">
              {option.name}
            </option>
          );
        })}
      </select>
    </InputShell>
  );
}
