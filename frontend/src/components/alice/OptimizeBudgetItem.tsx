import PercentageBar from '../PercentageBar.tsx';

interface OptimizeBudgetItemProp {
  label: string;
  currentAmount: number;
  recommendationPercent: number;
  totalBudget: number;
}

export default function OptimizeBudgetItem({
  label,
  currentAmount,
  recommendationPercent,
  totalBudget,
}: OptimizeBudgetItemProp) {
  const recPercent = Math.round(recommendationPercent * 100);

  const currPercent = totalBudget > 0 ? Math.round((currentAmount / totalBudget) * 100) : 0;

  return (
    <div className="flex w-full h-h-full items-center justify-between gap-4">
      <label className="min-w-25 text-sm">{label}</label>
      <div className="flex flex-col w-full gap-1">
        <PercentageBar
          percentage={currPercent}
          label="current spending"
          styleBar="bg-text-muted"
          styleDiv="h-1.5"
        />
        <PercentageBar
          percentage={recPercent}
          label="ai recommendation"
          styleBar="bg-purple-600"
          styleDiv="h-1.5"
        />
      </div>
      <div className="min-w-11">
        <p className="text-purple-600 font-bold min-w-11.25] text-right">{recPercent}%</p>
      </div>
    </div>
  );
}
