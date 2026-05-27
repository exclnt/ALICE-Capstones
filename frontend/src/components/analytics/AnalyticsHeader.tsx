import { useStatusHandler } from '../../hooks/useStatusHandler';
import { useThisMonthTotalExpense } from '../../hooks/useTransactionHook';
import { CurrencyFormatter } from '../utils/CurrencyFormatter';

export default function AnalyticsHeader() {
  const { data, isPending, isError, error, isSuccess } = useThisMonthTotalExpense();

  useStatusHandler({
    pending: isPending,
    error,
    isError,
    isSuccess,
  });

  return (
    <header className="flex flex-row w-full justify-between font-mplus text-text-main">
      <div className="flex flex-col">
        <h3 className="text-gray-400">Total Pengeluaran Bulan Ini</h3>
        <h1 className="font-bold text-black text-2xl">
          {CurrencyFormatter(data?.totalExpense?.toString() || '0')}
        </h1>
      </div>
    </header>
  );
}
