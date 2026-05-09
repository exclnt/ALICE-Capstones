import BudgetConfig from '../components/profile/BudgetConfig';
import ThemeConfig from '../components/profile/ThemeConfig';
import ProfileCard from '../components/profile/ProfileCard';

export default function Profile() {
  return (
    <div className="flex flex-col w-full gap-7 flex-1 pb-20 md:pb-0">
      <ProfileCard />
      <section className="config text-text-main flex flex-row justify-between gap-7">
        <BudgetConfig />
        <ThemeConfig />
      </section>
      <div className="actions w-full flex">
        <button className="bg-red-500 text-white w-full rounded-xl p-3 font-bold">Keluar</button>
      </div>
    </div>
  );
}
