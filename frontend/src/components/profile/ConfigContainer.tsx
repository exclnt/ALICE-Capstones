import { Icon } from '@iconify/react';
import type React from 'react';

interface ConfigContainerPropType {
  label: string;
  icon: string;
  children: React.ReactNode;
}

export default function ConfigContainer({ label, icon, children }: ConfigContainerPropType) {
  return (
    <div className="p-2 rounded-xl py-3 ring-1 ring-primary/20 w-full">
      <header className="flex flex-row items-center justify-between">
        <h2 className="font-medium">{label}</h2>
        <Icon icon={icon} className="text-2xl" />
      </header>
      <div>{children}</div>
    </div>
  );
}
