import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const fmt = (n) =>
  '₨' + (n >= 1000 ? (n / 1000).toFixed(0) + 'k' : n);

const fmtFull = (n) =>
  '₨ ' + n.toLocaleString('en-PK', { maximumFractionDigits: 0 });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>
          {p.name}: {fmtFull(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function IncomeExpensesChart({ transactions }) {
  const { theme } = useTheme();
  const gridColor = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  const tickColor = theme === 'light' ? '#64748b' : '#6b7280';
  const cursorColor = theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)';
  const legendColor = theme === 'light' ? '#475569' : '#9ca3af';

  const data = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      Income: 0,
      Expenses: 0,
    };
  });

  transactions.forEach((tx) => {
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const entry = data.find((m) => m.key === key);
    if (!entry) return;
    if (tx.type === 'income') entry.Income += tx.amount;
    else entry.Expenses += tx.amount;
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={4} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} width={40} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorColor }} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12, color: legendColor }} />
        <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
