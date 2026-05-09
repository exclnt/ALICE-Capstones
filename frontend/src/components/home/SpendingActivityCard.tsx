import { Link } from 'react-router-dom';
import TransactionItem from '../TransactionItem';

export default function SpendingActivityCard() {
  const date = '13 April 2026';
  return (
    <section className="spending-activity-card bg-bg-main p-5 rounded-2xl h-full w-full flex flex-col gap-3 ring-1 ring-primary/20 shadow-md">
      <div className="flex justify-between w-full">
        <h2 className="font-medium">Aktivitas Pengeluaran</h2>
        <Link to={'/analitik'} className="text-primary font-bold">
          Lihat Semua
        </Link>
      </div>
      <div className="p-1 flex-col flex gap-4 md:h-full h-60 overflow-y-auto w-full">
        <TransactionItem
          icon="material-symbols:attach-money-rounded"
          name="Money Laundering"
          date={date}
          price="180000"
        />
        <TransactionItem
          icon="material-symbols:attach-money-rounded"
          name="Money Laundering"
          date={date}
          price="180000"
        />
        <TransactionItem
          icon="material-symbols:attach-money-rounded"
          name="Money Laundering"
          date={date}
          price="15000"
        />
        <TransactionItem
          icon="material-symbols:attach-money-rounded"
          name="Money Laundering"
          date={date}
          price="1200"
        />
        <TransactionItem
          icon="material-symbols:attach-money-rounded"
          name="Money Laundering"
          date={date}
          price="20000"
        />
        <TransactionItem
          icon="material-symbols:attach-money-rounded"
          name="Money Laundering"
          date={date}
          price="18000000"
        />
      </div>
    </section>
  );
}
