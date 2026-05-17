import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#ec4899', '#84cc16'];

const fmtFull = (n) =>
  '₨ ' + n.toLocaleString('en-PK', { maximumFractionDigits: 0 });

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 2 }}>{name}</p>
      <p style={{ color: payload[0].payload.fill, fontSize: 12, fontWeight: 600 }}>{fmtFull(value)}</p>
    </div>
  );
};

export default function ExpenseBreakdownChart({ transactions }) {
  const { theme } = useTheme();
  const legendColor = theme === 'light' ? '#475569' : '#9ca3af';

  const map = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

  const data = Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-sm text-gray-700">No expense data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: 11, color: legendColor, paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
