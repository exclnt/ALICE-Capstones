import React, { useState } from 'react';
import InputShell from './InputShell.tsx';
import { CurrencyFormatter } from './utils/CurrencyFormatter.ts';

interface CurrencyInputProps {
  label: string;
  onValueChange: (amount: string) => void;
  value: string;
}

export default function CurrencyInput({ label, value, onValueChange }: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, '');
    onValueChange(cleanValue);
  };

  const displayValue = isFocused ? value : value ? CurrencyFormatter(value) : '';

  return (
    <InputShell label={label} isFocused={isFocused} hasValue={value.length > 0}>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent px-4 pt-2 pb-2 text-text-main rounded-xl outline-primary focus:outline-1 hover:outline-1"
      />
    </InputShell>
  );
}
