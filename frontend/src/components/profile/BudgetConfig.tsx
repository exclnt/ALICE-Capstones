import CurrencyInput from '../CurrencyInput.tsx';
import ConfigContainer from './ConfigContainer';
import useInput from '../hooks/useInput.tsx';

export default function BudgetConfig() {
  const [weekBudget, setWeekBudget] = useInput('');
  const [monthBudget, setMonthBudget] = useInput('');

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
          Simpan Konfigurasi
        </button>
      </form>
    </ConfigContainer>
  );
}
