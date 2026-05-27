import { useEffect } from 'react';
import { useBudgetOptimization, usePredictBalance } from '../hooks/useAnalyzeHook';
import AliceHeader from '../components/alice/AliceHeader';
import ForecastChartCard from '../components/alice/ForecastChartCard';
import OptimizeBudgetCard from '../components/alice/OptimizeBudgetCard';
import { extractError } from '../components/utils/ExtractApiError';
import { Icon } from '@iconify/react';
import { useUserSettings } from '../hooks/useUserSettingsHook';

export default function Alice() {
  const { data: predictResponse, isPending, error } = usePredictBalance();
  const hasWarnings = (predictResponse?.data?.warnings?.length ?? 0) > 0;
  const extracted = extractError(error);

  const MIN_BALANCE = -6418447.966666666;
  const MAX_BALANCE = 67893186.33333333;

  const forecastData =
    predictResponse?.data?.predictions?.map((value, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index + 1);

      const actualBalance = value * (MAX_BALANCE - MIN_BALANCE) + MIN_BALANCE;

      return {
        date: date.toISOString().split('T')[0],
        forecast: Math.round(actualBalance),
      };
    }) || [];

  const {
    mutate,
    data: budgetOptimizationData,
    isPending: isBudgetOptimizationLoading,
    error: budgetOptimizationError,
  } = useBudgetOptimization();

  const { data: settingsData } = useUserSettings();

  useEffect(() => {
    if (settingsData?.setting) {
      mutate({
        week: settingsData.setting.weekly_budget || 0,
        month: settingsData.setting.monthly_income || 0,
      });
    }
  }, [settingsData, mutate]);

  const allocations = budgetOptimizationData?.data?.allocations || [];

  return (
    <section className="p-5">
      <AliceHeader />
      <div className="mt-20 md:mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          {isPending ? (
            <div className="w-full h-60 bg-bg-main p-5 rounded-2xl flex items-center justify-center ring-1 ring-blue-600/20 shadow-md flex-col gap-5">
              <Icon icon="eos-icons:bubble-loading" className="text-blue-500 text-5xl" />
              <p className="text-text-muted">Memuat prediksi...</p>
            </div>
          ) : error ? (
            <div className="w-full h-60 bg-bg-main p-5 rounded-2xl flex items-center justify-center flex-col ring-1 ring-blue-600/20 shadow-md">
              <Icon icon="emojione-monotone:thinking-face" className="text-blue-500 text-5xl" />
              <p className="text-blue-500">{extracted.message}</p>
            </div>
          ) : (
            <ForecastChartCard data={forecastData} hasWarnings={hasWarnings} />
          )}

          {isBudgetOptimizationLoading ? (
            <div className="w-full h-60 bg-bg-main p-5 rounded-2xl flex items-center justify-center ring-1 ring-blue-600/20 shadow-md flex-col gap-5">
              <Icon icon="eos-icons:bubble-loading" className="text-blue-500 text-5xl" />
              <p className="text-text-muted">Memuat optimasi anggaran...</p>
            </div>
          ) : budgetOptimizationError ? (
            <div className="w-full h-60 bg-bg-main p-5 rounded-2xl flex items-center justify-center flex-col ring-1 ring-blue-600/20 shadow-md">
              <Icon icon="emojione-monotone:thinking-face" className="text-blue-500 text-5xl" />
              <p className="text-blue-500">{extractError(budgetOptimizationError).message}</p>
            </div>
          ) : (
            <OptimizeBudgetCard allocations={allocations} />
          )}
        </div>
        <div className="bg-bg-main p-5 rounded-2xl ring-1 ring-primary shadow-md">
          chatbot placeholder
        </div>
      </div>
    </section>
  );
}
