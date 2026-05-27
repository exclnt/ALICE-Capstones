/* eslint-disable camelcase */
import CurrencyInput from '../CurrencyInput.tsx';
import ConfigContainer from './ConfigContainer';
import useInput from '../../hooks/useInput.ts';
import { useUpdateUserSettings, useUserSettings } from '../../hooks/useUserSettingsHook.ts';
import { useEffect } from 'react';
import { useStatusHandler } from '../../hooks/useStatusHandler.ts';
import { useStatus } from '../../context/StatusContext.tsx';
export default function BudgetConfig() {
  const { showError } = useStatus();
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

  useStatusHandler({
    pending: isSettingsPending || isUpdating,

    isError: isSettingsError || isUpdateError,
    error: settingsError || updateError,

    isSuccess: isSettingsSuccess,
  });

  useStatusHandler({
    isSuccess: isUpdateSuccess,
    successMessage: updateData?.message,
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Number(weekBudget) > Number(monthBudget)) {
      showError('Anggaran mingguan tidak boleh melebihi anggaran bulanan');
      return;
    }
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
