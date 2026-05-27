import { Icon } from '@iconify/react';
import { CurrencyFormatter } from './utils/CurrencyFormatter';
import type { TransactionCategory } from '../validator/TransactionSchema';

interface TransactionItemProp {
  category: TransactionCategory;
  name: string;
  date: string;
  price: string;
}

const CATEGORY_CONFIG: Record<TransactionCategory, { icon: string; color: string }> = {
  Bills: { icon: 'lucide:receipt', color: 'bg-blue-100 text-blue-600' },
  Entertainment: { icon: 'lucide:ticket', color: 'bg-purple-100 text-purple-600' },
  Food: { icon: 'lucide:utensils', color: 'bg-orange-100 text-orange-600' },
  Hobby: { icon: 'lucide:palette', color: 'bg-pink-100 text-pink-600' },
  Investment: { icon: 'lucide:trending-up', color: 'bg-green-100 text-green-600' },
  Shopping: { icon: 'lucide:shopping-bag', color: 'bg-indigo-100 text-indigo-600' },
  Transport: { icon: 'lucide:car', color: 'bg-slate-100 text-slate-600' },
};

export default function TransactionItem({ category, name, date, price }: TransactionItemProp) {
  const { icon, color } = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Bills;

  return (
    <section className="flex flex-row items-center justify-between group cursor-pointer bg-bg-main rounded-xl p-2 ring-1 ring-primary/20 shadow-md hover:-translate-y-1 active:-translate-y-1 active:bg-primary active:scale-95 hover:bg-primary transition-transform duration-200 ">
      <div className="flex flex-row items-center gap-3">
        <div className={`${color} p-2 rounded-full transition-colors group-hover:brightness-95`}>
          <Icon icon={icon} className="shrink-0 text-xl" />
        </div>

        <div>
          <h2 className="font-bold text-text-main text-sm leading-tight">{name}</h2>
          <p className="text-xs text-text-muted group-hover:text-text-main transition-colors group-active:text-text-main">
            {date}
          </p>
        </div>
      </div>
      <h1 className="font-bold text text-text-main">{CurrencyFormatter(price)}</h1>
    </section>
  );
}
