import { Icon } from '@iconify/react';
import { useSearchParams } from 'react-router-dom';
import TransactionItem from '../TransactionItem';
import type { TransactionItemType } from '../../validator/TransactionSchema';
import _ from 'lodash';
import { getWeekOfMonth } from 'date-fns';
import { useCategories } from '../../hooks/useCategoriesHook';
import { useStatusHandler } from '../../hooks/useStatusHandler';
import { useState } from 'react';
import EditModalTransaction from './EditModalTransaction';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
};

const formatDate = (isoDate: string, options: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(isoDate));
};

export default function AnalyticsCard({ data = [] }: { data: TransactionItemType[] }) {
  const [isEditing, setIsEditing] = useState(false);

  const [editId, setEditId] = useState('null');

  const toggleEditing = (id: string) => {
    setIsEditing((prev) => !prev);
    setEditId((prev) => (prev === id ? 'null' : id));
  };

  const closeModal = () => {
    setIsEditing(false);
    setEditId('null');
  };

  const { data: categoriesData, isPending, isError, error, isSuccess } = useCategories();

  useStatusHandler({
    pending: isPending,
    error,
    isError,
    isSuccess,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = searchParams.get('query') || '';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchParams(
      (prevParams) => {
        if (value) {
          prevParams.set('query', value);
        } else {
          prevParams.delete('query');
        }
        return prevParams;
      },
      { replace: true }
    );
  };

  const filteredData = data.filter((tx) => {
    const lowerQuery = currentQuery.toLowerCase();

    const matchTitle = tx.title.toLowerCase().includes(lowerQuery);
    const formattedDate = formatDate(tx.transaction_date, DATE_OPTIONS).toLowerCase();
    const matchDate = formattedDate.includes(lowerQuery);
    const matchPrice = String(tx.amount).includes(lowerQuery);

    return matchTitle || matchDate || matchPrice;
  });

  const groupedData = _.groupBy(filteredData, (item) => {
    const weekNumber = getWeekOfMonth(new Date(item.transaction_date));
    return `MINGGU KE-${weekNumber}`;
  });

  return (
    <div className="text-text-main font-mplus forecast-card w-full h-full p-5 -mt-5 flex flex-col gap-3 b">
      <EditModalTransaction
        id={editId}
        closeModal={closeModal}
        isEditing={isEditing}
        categoriesData={categoriesData}
      />

      {/* Search and Filter UI */}
      <div className="flex pt-5 gap-3 mb-2">
        <div className="relative flex-1 flex items-center">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Icon icon="lucide:search" className="text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            value={currentQuery}
            onChange={handleSearchChange}
            placeholder="Ketikan Tanggal Waktu Pencarian"
            className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-gray-800 border-none rounded-xl text-sm text-text-muted focus:text-text-main focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <button className="p-2 bg-gray-200 dark:bg-gray-800 rounded-xl transition-colors">
          <Icon icon="lucide:filter" className="text-gray-500 w-6 h-6" />
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-8 overflow-y-scroll p-2">
        {filteredData.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-10">Tidak ada data transaksi.</div>
        ) : (
          Object.entries(groupedData).map(([week, transactions]) => (
            <div key={week} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide">{week}</h3>
              </div>

              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => toggleEditing(tx.id)}
                    className="cursor-pointer hover:opacity-80 transition-opacity" // Added cursor pointer for better UX
                  >
                    <TransactionItem
                      category={tx.category}
                      name={tx.title}
                      date={formatDate(tx.transaction_date, DATE_OPTIONS)}
                      price={String(tx.amount)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
