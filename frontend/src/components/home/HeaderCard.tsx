import Greeting from './Greeting';
import { useUserProfile } from '../../hooks/UserProfileHooks';
import { useStatus } from '../../context/StatusContext';
import { extractError } from '../utils/ExtractApiError';
import { useEffect } from 'react';
import { useUserSettings } from '../../hooks/UserSettingsHook';
import { CurrencyFormatter } from '../utils/CurrencyFormatter';

export default function HeaderCard() {
  const {
    data: profileData,
    error: profileError,
    isPending: profilePending,
    isError: profileIserror,
  } = useUserProfile();
  const {
    data: settingsData,
    error: settingsError,
    isPending: settingsPending,
    isError: settingsIsError,
  } = useUserSettings();

  const { showLoading, showError } = useStatus();

  useEffect(() => {
    if (profilePending || settingsPending) {
      showLoading();
    }
  }, [profilePending, showLoading, settingsPending]);

  useEffect(() => {
    if (profileError || settingsError) {
      const extracted = extractError(profileError || settingsError);

      showError(extracted.message, extracted.statusCode);
    }
  }, [profileIserror, settingsIsError, showError, profileError, settingsError]);

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
