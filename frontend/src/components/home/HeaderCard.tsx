import Greeting from './Greeting';
import { useUserProfile } from '../../hooks/useUserProfileHooks';
import { useUserSettings } from '../../hooks/useUserSettingsHook';
import { CurrencyFormatter } from '../utils/CurrencyFormatter';
import { useStatusHandler } from '../../hooks/useStatusHandler';
import { useQuery } from '@tanstack/react-query';
import { useThisMonthTotalExpense } from '../../hooks/useTransactionHook';
import { Icon } from '@iconify/react';

export default function HeaderCard() {
  const {
    data: profileData,
    error: profileError,
    isPending: profilePending,
    isError: profileIsError,
    isSuccess: profileIsSuccess,
  } = useUserProfile();
  const {
    data: settingsData,
    error: settingsError,
    isPending: settingsPending,
    isError: settingsIsError,
    isSuccess: settingsIsSuccess,
  } = useUserSettings();

  const {
    data: monthData,
    isPending: monthPending,
    isError: monthIsError,
    error: monthError,
    isSuccess: monthIsSuccess,
  } = useThisMonthTotalExpense();

  useStatusHandler({
    pending: profilePending || settingsPending || monthPending,
    isError: profileIsError || settingsIsError || monthIsError,
    error: profileError || settingsError || monthError,
    isSuccess: profileIsSuccess && settingsIsSuccess && monthIsSuccess,
  });

  const { data: lastAmount } = useQuery({
    queryKey: ['lastAmount'],
    queryFn: () => null,
    staleTime: Infinity,
    initialData: null,
  });

  const currentBudget =
    (settingsData?.setting.monthly_income ?? 0) - (monthData?.totalExpense ?? 0);

  return (
    <header
      className="
        h-fit w-full p-6 rounded-xl
        bg-[url('/assets/img/background.png')]
        bg-cover bg-center relative flex flex-col gap-5 shadow-md"
    >
      <div className="absolute inset-0 bg-linear-to-r from-green-950/70 to-transparent rounded-xl z-10"></div>

      <div className="z-20 relative">
        <p className="text-text-muted text-sm">{Greeting()}</p>
        <h1 className="text-white text-xl font-bold">{profileData?.data.username}</h1>
      </div>

      <div className="z-20 relative">
        <p className="text-text-muted text-sm">Anggaran Bulanan</p>
        <div className="flex flex-row items-baseline justify-between">
          <h1 className="text-white text-2xl font-bold">
            {CurrencyFormatter(String(currentBudget))}
          </h1>
          <div className="text-red-400 text-base font-medium flex flex-row items-center gap-1">
            <p> {lastAmount && CurrencyFormatter(String(lastAmount))}</p>
            <Icon icon={'eva:diagonal-arrow-right-up-outline'} />
          </div>
        </div>
      </div>
    </header>
  );
}
