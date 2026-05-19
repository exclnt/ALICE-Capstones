import { Icon } from '@iconify/react';
import TransactionItem from '../TransactionItem';

type TransactionCategory =
  | 'Bills'
  | 'Entertainment'
  | 'Food'
  | 'Hobby'
  | 'Investment'
  | 'Shopping'
  | 'Transport';

interface Transaction {
  id: string;
  title: string;
  date: string; // ISO String
  amount: string;
  category: TransactionCategory;
}

const MOCK_DATA: Transaction[] = [
  {
    id: '1',
    title: 'Pembangunan Koperasi',
    date: '2026-04-13T00:00:00Z',
    amount: '100000',
    category: 'Bills',
  },
  {
    id: '2',
    title: 'Jajanan Ringan',
    date: '2026-04-13T00:00:00Z',
    amount: '2000',
    category: 'Food',
  },
  {
    id: '3',
    title: 'Investasi Saham',
    date: '2026-03-30T00:00:00Z',
    amount: '350000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
  {
    id: '4',
    title: 'Tabungan',
    date: '2026-03-30T00:00:00Z',
    amount: '50000',
    category: 'Investment',
  },
];

const formatDate = (isoDate: string, options: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(isoDate));
};

export default function AnalyticsCard() {
  const groupedData = MOCK_DATA.reduce(
    (acc, item) => {
      const monthHeader = formatDate(item.date, { month: 'long', year: 'numeric' }).toUpperCase();
      if (!acc[monthHeader]) {
        acc[monthHeader] = [];
      }
      acc[monthHeader].push(item);
      return acc;
    },
    {} as Record<string, Transaction[]>
  );

  return (
    <div className="text-text-main font-mplus forecast-card w-full h-full p-5  -mt-5 flex flex-col gap-3 b">
      <div className="flex pt-5 gap-3 mb-2">
        <div className="relative flex-1 flex  items-center">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Icon icon="lucide:search" className="text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Ketikan Tanggal Waktu Pencarian"
            className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-gray-800 border-none rounded-xl text-sm text-text-muted focus:text-text-main focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <button className="p-2 bg-gray-200 dark:bg-gray-800 rounded-xl  transition-colors">
          <Icon icon="lucide:filter" className="text-gray-500 w-6 h-6" />
        </button>
      </div>

      <div className="space-y-8 overflow-y-scroll ">
        {Object.entries(groupedData).map(([month, transactions]) => (
          <div key={month} className="space-y-4 ">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wide">{month}</h3>
            </div>

            <div className="space-y-4">
              {transactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  category={tx.category}
                  name={tx.title}
                  date={formatDate(tx.date, { day: 'numeric', month: 'long', year: 'numeric' })}
                  price={tx.amount}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
