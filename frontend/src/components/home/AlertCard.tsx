import { Icon } from '@iconify/react';
import { CurrencyFormatter } from '../utils/CurrencyFormatter';

interface AlertCardProp {
  currentBudget: number;
  weekBudget: number;
}

export default function AlertCard({ currentBudget, weekBudget }: AlertCardProp) {
  const budgetPercent = weekBudget > 0 ? (currentBudget / weekBudget) * 100 : 0;

  return (
    <section className="">
      <div className="bg-bg-main p-5 rounded-2xl  flex flex-col gap-3 ring-1 ring-primary/20 shadow-md">
        <h2 className="font-bold text-text-main text-sm">Anggaran Mingguan</h2>
        <div className="flex flex-row justify-between text-xs">
          <h2 className="text-text-muted">
            {CurrencyFormatter(currentBudget.toString())} /{' '}
            {CurrencyFormatter(weekBudget.toString())}
          </h2>
          <h2 className="font-bold text-red-500">{budgetPercent.toFixed(0)}%</h2>
        </div>
        <ProgressBar progress={budgetPercent} />

        <div className="flex flex-row items-center gap-3 bg-red-500/10 py-2 px-3 rounded-xl border border-red-500/20">
          <Icon
            icon="material-symbols:warning-rounded"
            className="text-2xl text-red-500 shrink-0"
          />
          <p className="text-red-500 text-[12px] leading-tight">
            Awas! Pengeluaranmu hampir melebihi batas. Tunda dulu pengeluaran yang tidak penting.
          </p>
        </div>
      </div>
    </section>
  );
}

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div
      className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="bg-red-500 h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
