import { Icon } from '@iconify/react';
import BudgetConfig from '../components/profile/BudgetConfig';
import ThemeConfig from '../components/profile/ThemeConfig';

export default function Profile() {
  return (
    <main className="flex-col w-full  gap-5 flex flex-1 md:h-full md:bg-bg-main md:rounded-xl p-5">
      <section className="user-card text-bg-main flex items-center justify-between w-full bg-primary p-4 py-5 rounded-2xl">
        <div className="flex items-center gap-2">
          <Icon icon={'gg:profile'} className="text-5xl" />
          <div>
            <h2 className="font-bold text-xl">Eko Ramadani</h2>
            <p className="text-xs bg-secondary text-text-muted p-1 pl-3 pr-3 rounded-xl max-w-fit">
              UID : 24124240
            </p>
          </div>
        </div>
        <Icon icon={'material-symbols:edit-square-outline'} className="text-2xl" />
      </section>
      <section className="config text-text-main">
        <BudgetConfig />
        <ThemeConfig />
        <div></div>
      </section>
      <div className="actions w-full flex">
        <button className="bg-red-500 text-white w-full rounded-xl p-3 font-bold">Keluar</button>
      </div>
    </main>
  );
}
