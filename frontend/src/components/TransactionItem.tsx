import { Icon } from '@iconify/react';
import { CurrencyFormatter } from './utils/CurrencyFormatter';

interface TransactionItemProp {
  icon: string;
  name: string;
  date: string;
  price: string;
}

export default function TransactionItem({ icon, name, date, price }: TransactionItemProp) {
  return (
    <section className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <div className="bg-green-600/50 p-2 rounded-xl">
          <Icon icon={icon} className="shrink-0 text-xl" />
        </div>

        <div>
          <h2 className="font-bold text-text-main">{name}</h2>
          <p className="text-sm text-text-muted">{date}</p>
        </div>
      </div>
      <h1 className="font-bold text-xl text-text-main">{CurrencyFormatter(price)}</h1>
    </section>
  );
}
