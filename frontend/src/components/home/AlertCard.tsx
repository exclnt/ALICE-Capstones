import { Icon } from '@iconify/react';
import { CurrencyFormatter } from '../utils/CurrencyFormatter';
import PercentageBar from '../PercentageBar';
import { useUserSettings } from '../../hooks/useUserSettingsHook';
import { useThisWeekTotalExpense } from '../../hooks/useTransactionHook';
import { useStatusHandler } from '../../hooks/useStatusHandler';

export default function AlertCard() {
  const {
    data: weekData,
    isPending: weekPending,
    isError: weekIsError,
    error: weekError,
    isSuccess: weekIsSuccess,
  } = useThisWeekTotalExpense();
  const {
    data: userSettings,
    isPending: userSettingsPending,
    isError: userSettingsIsError,
    error: userSettingsError,
    isSuccess: userSettingsIsSuccess,
  } = useUserSettings();

  useStatusHandler({
    pending: weekPending || userSettingsPending,
    error: weekError || userSettingsError,
    isError: weekIsError || userSettingsIsError,
    isSuccess: weekIsSuccess && userSettingsIsSuccess,
  });

  const weekBudget = userSettings?.setting.weekly_budget || 0;
  const currentBudget = weekData?.totalExpense || 0;

  const budgetPercent = weekBudget > 0 ? (currentBudget / weekBudget) * 100 : 0;
  const barColor =
    budgetPercent >= 90
      ? 'bg-red-500'
      : budgetPercent >= 75
        ? 'bg-orange-500'
        : budgetPercent >= 50
          ? 'bg-yellow-500'
          : 'bg-green-500';
  const textColor =
    budgetPercent >= 90
      ? 'text-red-500'
      : budgetPercent >= 75
        ? 'text-orange-500'
        : budgetPercent >= 50
          ? 'text-yellow-500'
          : 'text-green-500';

  return (
    <section className="">
      <div className="bg-bg-main p-5 rounded-2xl  flex flex-col gap-3 ring-1 ring-primary/20 shadow-md">
        <h2 className="font-bold text-text-main text-sm">Anggaran Mingguan</h2>
        <div className="flex flex-row justify-between text-xs">
          <h2 className="text-text-muted">
            {CurrencyFormatter(currentBudget.toString())} /{' '}
            {CurrencyFormatter(weekBudget.toString())}
          </h2>
          <h2 className={`font-bold ${textColor}`}>{budgetPercent.toFixed(0)}%</h2>
        </div>
        <PercentageBar percentage={budgetPercent} label="progress bar" styleBar={barColor} />

        {budgetPercent >= 80 && (
          <div className="flex flex-row items-center gap-3 bg-red-500/10 py-2 px-3 rounded-xl border border-red-500/20">
            <Icon
              icon="material-symbols:warning-rounded"
              className="text-2xl text-red-500 shrink-0"
            />
            <p className="text-red-500 text-[12px] leading-tight">
              Awas! Pengeluaranmu hampir melebihi batas. Tunda dulu pengeluaran yang tidak penting.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
