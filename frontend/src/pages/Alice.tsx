import { usePredictBalance } from '../hooks/useAnalyzeHook';
import { useThisMonthTransactions } from '../hooks/useTransactionHook';
import AliceHeader from '../components/alice/AliceHeader';
import ForecastChartCard from '../components/alice/ForecastChartCard';
import OptimizeBudgetCard from '../components/alice/OptimizeBudgetCard';
import { Icon } from '@iconify/react';

export default function Alice() {
  const { data: transactions } = useThisMonthTransactions();

  const REQUIRED_DATA_POINTS = 30;
  const currentDataPoints = transactions?.transactions.length || 0;
  const isColdStart = currentDataPoints < REQUIRED_DATA_POINTS;
  const dataPointsLeft = REQUIRED_DATA_POINTS - currentDataPoints;

  const { data: predictResponse, isLoading, error } = usePredictBalance(!isColdStart);

  const hasWarnings = !isColdStart && (predictResponse?.data?.warnings?.length ?? 0) > 0;

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

  return (
    <section className="p-5">
      <AliceHeader />
      <div className="mt-20 md:mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          {isColdStart ? (
            <div className="w-full h-60 bg-bg-main p-5 rounded-2xl flex flex-col items-center justify-center text-center ring-1 ring-blue-600/20 shadow-md">
              <Icon
                className="text-4xl text-blue-400 mb-2"
                icon={'material-symbols:database-off-outline-rounded'}
              />
              <h3 className="font-bold text-text-main">A.L.I.C.E Sedang Belajar</h3>
              <p className="text-sm text-text-muted mt-2 px-4">
                Kami butuh{' '}
                <span className="font-bold text-blue-500">{dataPointsLeft} transaksi lagi</span>{' '}
                untuk menganalisis kebiasaan finansial Anda dan memberikan prediksi yang akurat.
              </p>
            </div>
          ) : isLoading ? (
            <div className="w-full h-60 bg-bg-main p-5 rounded-2xl flex items-center justify-center ring-1 ring-blue-600/20 shadow-md">
              <p className="text-text-muted">Memuat prediksi...</p>
            </div>
          ) : error ? (
            <div className="w-full h-60 bg-bg-main p-5 rounded-2xl flex items-center justify-center ring-1 ring-red-600/20 shadow-md">
              <p className="text-red-500">Gagal memuat prediksi</p>
            </div>
          ) : (
            <ForecastChartCard data={forecastData} hasWarnings={hasWarnings} />
          )}

          <OptimizeBudgetCard />
        </div>
        <div className="bg-bg-main p-5 rounded-2xl ring-1 ring-primary shadow-md">
          chatbot placeholder
        </div>
      </div>
    </section>
  );
}
