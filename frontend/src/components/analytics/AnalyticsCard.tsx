import { Icon } from '@iconify/react';
import { useSearchParams } from 'react-router-dom';
import TransactionItem from '../TransactionItem';
import _ from 'lodash';
import { getWeekOfMonth } from 'date-fns';
import { useCategories } from '../../hooks/useCategoriesHook';
import { useStatusHandler } from '../../hooks/useStatusHandler';
import { useState } from 'react';
import EditModalTransaction from './EditModalTransaction';
import { CategorySelectionModal } from './CategorySelectionModal';
import { useGetTransactionsThisYear } from '../../hooks/useTransactionHook';
import type { TransactionItemType } from '../../validator/TransactionSchema';

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
  const [isSelecting, setIsSelecting] = useState(false);
  const toggleSelecting = () => setIsSelecting((prev) => !prev);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [page, setPage] = useState(1);

  const {
    data: queryData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetTransactionsThisYear(page);

  const transactions = viewMode === 'month' ? data : queryData?.transactions || [];

  const filteredCategoriesData =
    selectedCategories.length > 0
      ? transactions.filter((item) => selectedCategories.includes(item.category))
      : transactions;

  const [editId, setEditId] = useState('null');

  const toggleEditing = (id: string) => {
    setIsEditing((prev) => !prev);
    setEditId((prev) => (prev === id ? 'null' : id));
  };

  const closeModal = () => {
    setIsEditing(false);
    setEditId('null');
  };

  const {
    data: categoriesData,
    isPending: catPending,
    isError: catError,
    error: catErrorMsg,
    isSuccess: catSuccess,
  } = useCategories();

  useStatusHandler({
    pending: isLoading || catPending,
    error: error || catErrorMsg,
    isError: isError || catError,
    isSuccess: isSuccess && catSuccess,
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

  const filteredData = filteredCategoriesData.filter((tx) => {
    const lowerQuery = currentQuery.toLowerCase();

    const matchTitle = tx.title.toLowerCase().includes(lowerQuery);

    const formattedDate = formatDate(tx.transaction_date, DATE_OPTIONS).toLowerCase();
    const matchDate = formattedDate.includes(lowerQuery);

    const matchPrice = String(tx.amount).includes(lowerQuery);

    return matchTitle || matchDate || matchPrice;
  });

  const processedData =
    viewMode === 'month'
      ? filteredData.filter((tx) => {
          const date = new Date(tx.transaction_date);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        })
      : filteredData;

  const groupedData = _.groupBy(processedData, (item) => {
    const date = new Date(item.transaction_date);
    if (viewMode === 'month') {
      const weekNumber = getWeekOfMonth(date);
      return `MINGGU KE-${weekNumber}`;
    } else {
      return formatDate(item.transaction_date, { month: 'long', year: 'numeric' });
    }
  });

  return (
    <div className="text-text-main font-mplus forecast-card w-full h-full pt-5 px-5 pb-0 -mt-5 flex flex-col gap-3 b">
      <CategorySelectionModal
        isSelecting={isSelecting}
        toggleSelecting={toggleSelecting}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <EditModalTransaction
        id={editId}
        closeModal={closeModal}
        isEditing={isEditing}
        categoriesData={categoriesData}
      />

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
            className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-gray-800 border-none rounded-xl text-sm text-text-muted focus:text-text-main focus:ring-2 focus:ring-primary/25 outline-none"
          />
        </div>
        <button
          className="p-2 bg-gray-200 hover:text-primary text-gray-500 dark:bg-gray-800 rounded-xl transition-colors hover:ring-1 hover:ring-primary/25 hover:bg-gray-300 dark:hover:bg-gray-700"
          onClick={toggleSelecting}
        >
          <Icon icon="lucide:filter" className=" w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('month')}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
            viewMode === 'month'
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-800 text-text-muted hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Bulan Ini
        </button>
        <button
          onClick={() => setViewMode('year')}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
            viewMode === 'year'
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-800 text-text-muted hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Tahun Ini
        </button>
      </div>

      <div className="space-y-8 overflow-y-scroll p-2">
        {filteredData.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-10">Tidak ada data transaksi.</div>
        ) : (
          <>
            {Object.entries(groupedData).map(([group, txs]) => (
              <div key={group} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
                    {group}
                  </h3>
                </div>

                <div className="space-y-4">
                  {txs.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => toggleEditing(tx.id)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <TransactionItem
                        category={tx.category}
                        name={tx.title}
                        date={formatDate(
                          tx.transaction_date,
                          viewMode === 'month'
                            ? DATE_OPTIONS
                            : { day: 'numeric', month: 'long', year: 'numeric' }
                        )}
                        price={String(tx.amount)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {viewMode === 'year' && (
        <div className="flex justify-center gap-4 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-xs self-center">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded-lg"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
