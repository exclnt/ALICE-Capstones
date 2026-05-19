import React from 'react';

interface InputShellProps {
  label: string;
  isFocused: boolean;
  hasValue: boolean;
  children: React.ReactNode;
}

export default function InputShell({ label, isFocused, hasValue, children }: InputShellProps) {
  const shouldMoveLabel = isFocused || hasValue;

  return (
    <div className="relative bg-primary/50 rounded-xl shrink-0 w-full mt-8">
      <label
        className={`absolute left-2 transition-all duration-200 pointer-events-none z-10
                ${
                  shouldMoveLabel
                    ? '-top-6 text-sm font-medium text-text-main'
                    : 'top-1/2 -translate-y-1/2 text-sm text-text-muted'
                }`}
      >
        {label}
      </label>
      <div className="relative flex items-center">{children}</div>
    </div>
  );
}
