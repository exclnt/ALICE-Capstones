import AlertCard from '../components/home/AlertCard';
import HeaderCard from '../components/home/HeaderCard';
import RecommendationCard from '../components/home/RecommendationCard';
import SavedBudgetCard from '../components/home/SavedBudgetCard';
import SpendingActivityCard from '../components/home/SpendingActivityCard';
import { useBudgetOptimization } from '../hooks/useAnalyzeHook';
import PageTitle from '../components/PageTitle';
import { useUserSettings } from '../hooks/useUserSettingsHook';

export default function Home() {
  const { data: settingsData } = useUserSettings();

  const optimizationPayload = {
    week: settingsData?.setting?.weekly_budget || 0,
    month: settingsData?.setting?.monthly_income || 0,
  };

  const { data: budgetOptimizationData } = useBudgetOptimization(optimizationPayload);

  const hasOptimizationResponse = budgetOptimizationData?.status === 'success';
  return (
    <div className="flex flex-col md:h-full gap-5 p-5">
      <PageTitle title="Beranda" />
      <HeaderCard />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5 ">
          <AlertCard />
          {hasOptimizationResponse && <RecommendationCard />}
          <SavedBudgetCard />
        </div>
        <div className="right flex flex-col h-76 mb-5 md:mb-0 md:h-76 lg:h-auto lg:min-h-90">
          <SpendingActivityCard />
        </div>
      </div>
    </div>
  );
}
