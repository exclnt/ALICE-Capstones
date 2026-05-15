import { Icon } from '@iconify/react';

export default function AliceHeader() {
  return (
    <header className="fixed md:static top-0 md:rounded-xl left-0 right-0 p-3 flex flex-row items-center justify-between ring-1 ring-primary">
      <div>
        <h1 className="text-xl font-bold text-text-main">A.L.I.C.E</h1>
        <div className="flex justify-between">
          <Icon className="text-green-600" icon={'stash:circle-duotone'} />
          <h3 className="text-xs text-text-muted">AI ONLINE</h3>
        </div>
      </div>
      <h2 className="text-xs font-medium text-orange-400 bg-orange-400/25 rounded-xl p-1 px-2 ring-1 ring-orange-400/60">
        IMPLUSIF TINGGI
      </h2>
    </header>
  );
}
