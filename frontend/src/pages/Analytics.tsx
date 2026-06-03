import { useState } from 'react';
import AnalyticsHeader from '../components/analytics/AnalyticsHeader';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import { useGetTransactionsThisYear } from '../hooks/useTransactionHook';
import { useStatusHandler } from '../hooks/useStatusHandler';
import PageTitle from '../components/PageTitle';

export default function Analytics() {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => new Date());

  const { data, isPending, isError, error, isSuccess } = useGetTransactionsThisYear();

  useStatusHandler({
    pending: isPending,
    error,
    isError,
    isSuccess,
  });
  const allTransactions = data?.transactions || [];

  const filteredMonthData = allTransactions.filter((tx) => {
    const date = new Date(tx.transaction_date);
    return (
      date.getMonth() === selectedMonth.getMonth() &&
      date.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const monthTotalExpense = filteredMonthData.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(selectedMonth);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 h-full md:gap-4 bg-green-200">
      <PageTitle title="Analitik" />
      <div className="flex flex-col px-5 pt-5 bg-green-200 w-full rounded-lg">
        <AnalyticsHeader totalExpense={monthTotalExpense} monthName={monthName} />
        <div className="flex-1 min-h-60 w-full relative overflow-hidden pt-5">
          <AnalyticsChart data={filteredMonthData} />
        </div>
      </div>

      <div className="w-full h-108 flex flex-col lg:pt-16 lg:h-full  overflow-hidden -mt-1.5">
        <div className="flex-1 w-full lg:h-full  bg-bg-main rounded-tl-2xl rounded-tr-2xl lg:rounded-tr-none border-t-2 border-primary/50 pt overflow-hidden flex flex-col">
          <AnalyticsCard
            data={allTransactions}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
      </div>
    </section>
  );
}
