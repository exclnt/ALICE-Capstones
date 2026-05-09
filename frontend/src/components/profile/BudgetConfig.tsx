import React from 'react';
import CurrencyInput from './CurrencyInput';
import ConfigContainer from './ConfigContainer';

export default function BudgetConfig() {
  const [weekBudget, setWeekBudget] = React.useState<string>('');
  const [monthBudget, setMonthBudget] = React.useState<string>('');
  // const handleSave = (val: number) => {
  //   console.log('Budget updated to:', val);
  // };

  return (
    <ConfigContainer label="KONFIGRUASI ANGGARAN" icon="ph:gear-six-light">
      <form className="flex flex-col gap-4 p-3">
        <CurrencyInput label="Anggaran Mingguan" onValueChange={setWeekBudget} value={weekBudget} />
        <CurrencyInput
          label="Anggaran Bulanan"
          onValueChange={setMonthBudget}
          value={monthBudget}
        />
        <button
          type="submit"
          className="bg-primary font-bold text-bg-main rounded-xl p-2 mt-10 w-full"
        >
          SIMPAN KONFIGURASI
        </button>
      </form>
    </ConfigContainer>
  );
}
