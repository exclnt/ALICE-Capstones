import { Icon } from '@iconify/react';
import { CurrencyFormatter } from '../utils/CurrencyFormatter';
import { useQuery } from '@tanstack/react-query';
import { isMonday } from 'date-fns';
import { useMemo } from 'react';

export default function SavedBudgetCard() {
  const { data: unusedBudget } = useQuery({
    queryKey: ['unusedBudget'],
    queryFn: () => null,
    staleTime: Infinity,
    initialData: 0,
  });
  const today = useMemo(() => new Date(), []);

  if (!isMonday(today) || !unusedBudget) return null;

  return (
    <section className="saved-budget-card flex flex-row bg-green-600/20  rounded-2xl gap-3 ring-1 ring-green-600/40 shadow-md">
      <div className="rounded-tl-2xl rounded-bl-2xl p-1 bg-green-600/30 flex items-center">
        <Icon
          icon={'material-symbols:money-bag-rounded'}
          className="shrink-0 text-2xl text-green-600 "
        />
      </div>

      <div className="flex flex-col items-start gap-1 mt-3 mb-3">
        <h2 className="font-bold text-green-600 text-base">Anggaran Terjaga</h2>
        <h2 className="text-green-600 font-bold text-2xl">
          {CurrencyFormatter(String(unusedBudget))}
        </h2>
      </div>
    </section>
  );
}
