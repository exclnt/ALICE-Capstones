import BudgetConfig from '../components/profile/BudgetConfig';
import ThemeConfig from '../components/profile/ThemeConfig';
import ProfileCard from '../components/profile/ProfileCard';

export default function Profile() {
  return (
    <main className="flex-col w-full  gap-5 flex flex-1 md:h-full md:bg-bg-main md:rounded-xl p-5 sha">
      <ProfileCard />
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
