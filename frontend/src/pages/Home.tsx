import AlertCard from '../components/home/AlertCard';
import HeaderCard from '../components/home/HeaderCard';
import RecommendationCard from '../components/home/RecommendationCard';
import SavedBudgetCard from '../components/home/SavedBudgetCard';
import SpendingActivityCard from '../components/home/SpendingActivityCard';

export default function Home() {
  return (
    <main className="flex flex-1 md:h-fit lg:h-screen md:max-h-217 md:bg-bg-main md:rounded-xl p-5 flex-col gap-5 pb-30 md:pb-5">
      <HeaderCard />
      <div className="flex w-full">
        <div className="flex flex-col gap-5 md:flex-row w-full">
          <div className="flex flex-1 flex-col gap-5">
            <AlertCard />
            <RecommendationCard />
            <SavedBudgetCard />
          </div>
          <div className="flex md:h-full flex-1">
            <SpendingActivityCard />
          </div>
        </div>
      </div>
    </main>
  );
}
