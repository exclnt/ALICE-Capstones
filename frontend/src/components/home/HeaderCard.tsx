import Greeting from './Greeting';
import { useUserProfile } from '../../hooks/useUserProfileHooks';
import { useUserSettings } from '../../hooks/useUserSettingsHook';
import { CurrencyFormatter } from '../utils/CurrencyFormatter';
import { useStatusHandler } from '../../hooks/useStatusHandler';

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

  useStatusHandler({
    pending: profilePending || settingsPending,
    isError: profileIsError || settingsIsError,
    error: profileError || settingsError,
    isSuccess: profileIsSuccess || settingsIsSuccess,
  });

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
            {CurrencyFormatter(String(settingsData?.setting.monthly_income))}
          </h1>
          <span className="text-red-400 text-base font-medium">Rp 2.000.000</span>
        </div>
      </div>
    </header>
  );
}
