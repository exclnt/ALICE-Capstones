import { Link } from 'react-router-dom';
import TransactionItem from '../TransactionItem';
import { useThisDayTransactions } from '../../hooks/useTransactionHook';
import { useStatusHandler } from '../../hooks/useStatusHandler';
import { format } from 'date-fns';

export default function SpendingActivityCard() {
  const { data, isPending, isError, error, isSuccess } = useThisDayTransactions();
  useStatusHandler({
    pending: isPending,
    error: error,
    isError: isError,
    isSuccess: isSuccess,
  });
  return (
    <section className="spending-activity-card bg-bg-main p-4 rounded-2xl w-full flex flex-col gap-3 ring-1 ring-primary/25 shadow-md h-full min-h-0">
      <div className="flex justify-between w-full">
        <h2 className="font-medium text-text-main flex flex-col md:flex-row gap-1">
          Aktivitas Pengeluaran <span>Hari Ini</span>
        </h2>
        <Link to={'/analitik'} className="text-primary font-bold">
          Lihat Semua
        </Link>
      </div>
      <div className="lg:relative overflow-y-auto  flex-1 overflow-hidden">
        <div className="lg:absolute p-1 lg:inset-0 flex-col flex gap-4 w-full">
          {(data?.transactions.length ?? 0) === 0 ? (
            <p className="text-sm text-text-muted text-center mt-10">
              Belum ada transaksi hari ini
            </p>
          ) : (
            data?.transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                category={transaction.category}
                name={transaction.title}
                date={format(new Date(transaction.transaction_date), 'dd MMMM yyyy')}
                price={transaction.amount.toString()}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
