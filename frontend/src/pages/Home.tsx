import AlertCard from '../components/home/AlertCard';
import HeaderCard from '../components/home/HeaderCard';
import RecommendationCard from '../components/home/RecommendationCard';
import SavedBudgetCard from '../components/home/SavedBudgetCard';
import SpendingActivityCard from '../components/home/SpendingActivityCard';

export default function Home() {
  return (
    <div className="flex flex-col md:h-full  gap-5 pb-20 md:pb-0">
      <HeaderCard />
      <div className="flex flex-col gap-5 md:flex-row w-full">
        <div className="flex flex-1 flex-col gap-5 md:h-full ">
          <AlertCard />
          <RecommendationCard />
          <SavedBudgetCard />
        </div>
        <div className="flex flex-1 min-h-0">
          <SpendingActivityCard />
        </div>
      </div>
    </div>
  );
}
