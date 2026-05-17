import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#a78bfa', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

const fmtFull = (n) =>
  '₨ ' + n.toLocaleString('en-PK', { maximumFractionDigits: 0 }) + '/mo';

function toMonthly(amount, recurrence) {
  if (recurrence === 'weekly') return amount * (52 / 12);
  if (recurrence === 'yearly') return amount / 12;
  return amount;
}

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

export default function SubscriptionBreakdownChart({ subscriptions }) {
  const { theme } = useTheme();
  const legendColor = theme === 'light' ? '#475569' : '#9ca3af';

  const map = {};
  subscriptions
    .filter((s) => s.isActive)
    .forEach((s) => {
      map[s.category] = (map[s.category] || 0) + toMonthly(s.amount, s.recurrence);
    });

  const data = Object.entries(map)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-sm text-gray-700">No active subscriptions yet</p>
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
