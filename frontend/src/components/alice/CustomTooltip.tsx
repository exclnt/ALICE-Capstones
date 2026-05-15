import { CurrencyFormatter } from '../utils/CurrencyFormatter';

interface PayloadItem {
  color?: string;
  name: string;
  value: string;
}

interface CustomTooltipProp {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

export default function CustomTooltip({ active, payload, label }: CustomTooltipProp) {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: 'var(--color-bg-main)',
          color: 'var(--color-text-main)',
          padding: '10px',
          border: '1px solid var(--color-primary)',
          borderRadius: '5px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }}
      >
        {label ? (
          <p className="label" style={{ fontWeight: 'bold', margin: 0 }}>{`${label}`}</p>
        ) : (
          ''
        )}
        <hr style={{ borderColor: 'var(--color-primary)', margin: '5px 0' }} />

        {payload.map((item) => (
          <p key={item.name} style={{ color: item.color, margin: '3px 0' }}>
            {`${item.name} : ${CurrencyFormatter(item.value)}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
}
