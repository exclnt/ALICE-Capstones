interface PrecentageBarProps {
  percentage: number;
  styleDiv?: string;
  styleBar?: string;
  label: string;
  tooltip?: string;
}

export default function PercentageBar({
  percentage,
  label,
  styleDiv = 'h-2.5',
  styleBar = 'bg-blue-500',
}: PrecentageBarProps) {
  return (
    <div className="relative group w-full">
      <div
        className={`w-full bg-gray-300 dark:bg-gray-700 rounded-full  overflow-hidden ${styleDiv}`}
        role={label}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-500 ease-out  ${styleBar}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
