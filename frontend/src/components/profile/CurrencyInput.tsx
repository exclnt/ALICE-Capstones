import React, { useState, useMemo } from 'react';
import InputShell from '../InputShell';

interface CurrencyInputProps {
  label: string;
  onValueChange: (amount: string) => void;
  value: string;
}

export default function CurrencyInput({ label, value, onValueChange }: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, '');
    onValueChange(cleanValue);
  };

  const displayValue = isFocused ? value : value ? formatter.format(Number(value)) : '';

  return (
    <InputShell label={label} isFocused={isFocused} hasValue={value.length > 0}>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent px-4 pt-2 pb-2 text-text-main rounded-xl outline-none"
      />
    </InputShell>
  );
}
