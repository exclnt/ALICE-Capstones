/* eslint-disable camelcase */
import CurrencyInput from '../CurrencyInput.tsx';
import ConfigContainer from './ConfigContainer';
import useInput from '../../hooks/useInput.ts';
import { useUpdateUserSettings, useUserSettings } from '../../hooks/UserSettingsHook.ts';
import { useEffect } from 'react';
import { useStatus } from '../../context/StatusContext.tsx';
import { extractError } from '../utils/ExtractApiError.ts';

export default function BudgetConfig() {
  const { showLoading, showError, showSuccess, hideStatus } = useStatus();

  const {
    data: settingsData,
    isPending: isSettingsPending,
    isSuccess: isSettingsSuccess,
    isError: isSettingsError,
    error: settingsError,
  } = useUserSettings();

  const {
    mutate,
    data: updateData,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateUserSettings();

  const [weekBudget, setWeekBudget] = useInput();
  const [monthBudget, setMonthBudget] = useInput();

  useEffect(() => {
    if (!settingsData) return;

    setWeekBudget(String(settingsData.setting.weekly_budget));

    setMonthBudget(String(settingsData.setting.monthly_income));
  }, [settingsData, setMonthBudget, setWeekBudget]);

  useEffect(() => {
    if (isSettingsPending || isUpdating) {
      showLoading();
    }
  }, [isSettingsPending, isUpdating, showLoading]);

  useEffect(() => {
    if (isSettingsError) {
      const extracted = extractError(settingsError);

      showError(extracted.message, extracted.statusCode);
    }
  }, [isSettingsError, settingsError, showError]);

  useEffect(() => {
    if (isSettingsSuccess) {
      hideStatus();
    }
  }, [isSettingsSuccess, hideStatus]);

  useEffect(() => {
    if (isUpdateError) {
      const extracted = extractError(updateError);

      showError(extracted.message, extracted.statusCode);
    }
  }, [isUpdateError, updateError, showError]);

  useEffect(() => {
    if (isUpdateSuccess && updateData) {
      showSuccess(updateData.message);
    }
  }, [isUpdateSuccess, updateData, showSuccess]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      monthly_income: Number(monthBudget),
      weekly_budget: Number(weekBudget),
    });
  };

  return (
    <ConfigContainer label="KONFIGRUASI ANGGARAN" icon="ph:gear-six-light">
      <form className="flex flex-col gap-4 p-3" onSubmit={handleSubmit}>
        <CurrencyInput
          label="Anggaran Mingguan"
          onValueChange={setWeekBudget}
          value={weekBudget}
          max={10000000000}
        />
        <CurrencyInput
          label="Anggaran Bulanan"
          onValueChange={setMonthBudget}
          value={monthBudget}
          max={10000000000}
        />
        <button
          type="submit"
          className="bg-primary font-bold text-bg-main rounded-xl p-2 mt-10 w-full"
        >
          Simpan Konfigurasi
        </button>
      </form>
    </ConfigContainer>
  );
}
