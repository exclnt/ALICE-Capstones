import { Icon } from '@iconify/react';
import type React from 'react';

interface ConfigContainerPropType {
  label: string;
  icon: string;
  children: React.ReactNode;
}

export default function ConfigContainer({ label, icon, children }: ConfigContainerPropType) {
  return (
    <div className="mb-6">
      <header className="flex flex-row items-center justify-between">
        <h2 className="font-medium">{label}</h2>
        <Icon icon={icon} className="text-2xl" />
      </header>
      <div>{children}</div>
    </div>
  );
}
